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
const makeResetPassword = require("./reset-password");
const createError = require("../../utils/create-error");
const Joi = require("joi");
const nodemailer = {
  createTransport: sinon
    .stub()
    .returns({ sendMail: sinon.stub().returns(true) }),
};

const jwt = {
  sign: () => {},
};

const usersDb = {
  setPasswordChanged: () => {},
};

let setPasswordChangedStub;
let signStub;

BeforeAll(() => {
  setPasswordChangedStub = sandBox.stub(usersDb, "setPasswordChanged");
  signStub = sandBox.stub(jwt, "sign");
});

Before(() => {
  setPasswordChangedStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("email");
  });

  signStub.callsFake((args) => {
    return "fake-jwt-token";
  });
});

After(() => {
  sandBox.resetHistory();
  this.organization_name = undefined;
  this.email = undefined;
});

AfterAll(() => {
  sandBox.restore();
  this.result = undefined;
  this.error = undefined;
});

Given(
  "organization_name:{string}, email:{string} reset-password",
  async (organization_name, email) => {
    this.organization_name = organization_name;
    this.email = email;
  }
);

When("sends a reset password mail", async () => {
  const resetPasswordByUser = makeResetPassword({
    usersDb,
    jwt,
    JWTKey: "testKey",
    nodemailer,
    Joi,
    createError,
  });

  try {
    await resetPasswordByUser(this.organization_name, this.email);
    this.result = "Password reset email sent successfully.";
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for send mail reset password",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).be.equal(result);
  }
);

Then(
  "it should return the error: {string} for send mail reset password",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
