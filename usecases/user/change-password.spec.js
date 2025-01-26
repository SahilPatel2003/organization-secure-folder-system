const {
  Given,
  When,
  Then,
  BeforeAll,
  Before,
  After,
  AfterAll,
} = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();
const makeChangePassword = require("./change-password");
const createError = require("../../utils/create-error");
const { token } = require("../../utils/token");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const usersDb = {
  getUserDetailsUsingEmailAndOrganization_name: () => {},
  changePassword: () => {},
};

let getUserDetailsUsingEmailAndOrganization_nameStub;

BeforeAll(() => {
  getUserDetailsUsingEmailAndOrganization_nameStub = sandBox.stub(
    usersDb,
    "getUserDetailsUsingEmailAndOrganization_name"
  );
  changePasswordStub = sandBox.stub(usersDb, "changePassword");
});

Before(() => {
  getUserDetailsUsingEmailAndOrganization_nameStub.callsFake((args) => {
    expect(args).to.have.own.property("email");
    expect(args).to.have.own.property("organization_name");
    if (this.password == "secondtime") return [{ is_password_changed: true }];
    return [{ is_password_changed: false }];
  });
  changePasswordStub.callsFake((args) => {
    expect(args).to.have.own.property("hash");
    expect(args).to.have.own.property("salt");
    expect(args).to.have.own.property("email");
    expect(args).to.have.own.property("organization_name");
  });
});

After(() => {
  sandBox.resetHistory();
  this.password = undefined;
  this.url = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "password:{string}, url:{string} change-password",
  async (password, url) => {
    this.password = password;
    this.url = url;
  }
);

When("try to change the password", async () => {
  const changePassword = makeChangePassword({
    usersDb,
    jwt: { verify: sinon.stub(), decode: jwt.decode },
    JWTKey: "jwt_key",
    url: { parse: sinon.stub().returns({ query: { token } }) },
    crypto: {
      randomBytes: sinon.stub().returns(true),
      pbkdf2Sync: sinon.stub().returns(true),
    },
    Joi,
    createError,
  });

  try {
    await changePassword(this.password, this.url);
    this.result = "Password updated successfully.";
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for changing the password",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).be.equal(result);
  }
);

Then(
  "it should return the error: {string} for changing the password",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
