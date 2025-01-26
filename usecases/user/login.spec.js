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
const makeLoginUser = require("./login");
const createError = require("../../utils/create-error");
const Joi = require("joi");

const usersDb = {
  getUserDetailsUsingEmailAndOrganization_name: () => {},
};

const organizationsDb = {
  getOrganizationId: () => {},
};

let getUserDetailsUsingEmailAndOrganization_nameStub;
let getOrganizationIdStub;

BeforeAll(() => {
  getUserDetailsUsingEmailAndOrganization_nameStub = sandBox.stub(
    usersDb,
    "getUserDetailsUsingEmailAndOrganization_name"
  );
  getOrganizationIdStub = sandBox.stub(organizationsDb, "getOrganizationId");
});

Before(() => {
  getUserDetailsUsingEmailAndOrganization_nameStub.callsFake((args) => {
    expect(args).to.have.own.property("email");
    expect(args).to.have.own.property("organization_name");

    if (args.email === "notfound@gmail.com") return [];
    if (this.password === "notMatched")
      return [
        {
          user_id: "c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf",
          organization_name: "TestOrg",
          role_id: null,
          username: "test_123",
          email: "test@gmail.com",
          hash: "false",
          salt: "false",
          is_admin: 1,
          user_status: 1,
        },
      ];
    return [
      {
        user_id: "c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf",
        organization_name: "TestOrg",
        role_id: null,
        username: "test_123",
        email: "test@gmail.com",
        hash: "true",
        salt: "true",
        is_admin: 1,
        user_status: 1,
      },
    ];
  });
  getOrganizationIdStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");

    if (args.organization_name === "not-found") return [];

    return [{ organization_id: "f821e8ee-4a66-438a-be7c-c36890413e2d" }];
  });
});

After(() => {
  sandBox.resetHistory();
  this.organization_name = undefined;
  this.email = undefined;
  this.password = undefined;
  this.rememberMe = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "organization_name:{string}, email:{string}, password:{string}, rememberMe:{string} login",
  async (organization_name, email, password, rememberMe) => {
    this.organization_name = organization_name;
    this.email = email;
    this.password = password;
    this.rememberMe = rememberMe;
  }
);

When("the user attempts to login", async () => {
  const loginUser = makeLoginUser({
    usersDb,
    organizationsDb,
    jwt: { sign: sinon.stub().returns("fake-jwt-token") },
    JWTKey: "testKey",
    crypto: {
      randomBytes: sinon.stub().returns(true),
      pbkdf2Sync: sinon.stub().returns(true),
    },
    createError,
    Joi,
  });

  try {
    await loginUser(
      this.organization_name,
      this.email,
      this.password,
      this.rememberMe
    );
    this.result = "User logged in successfully.";
  } catch (err) {
    this.error = err.message;
  }
});

Then("it should return the result: {string} for login", async (result) => {
  expect(this.error).to.be.undefined;
  expect(this.result).be.equal(result);
});

Then("it should return the error: {string} for login", async (error) => {
  expect(this.error).to.be.equal(error);
});
