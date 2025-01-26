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
const makeAddAdmin = require("./create-admin");
const createError = require("../../utils/create-error");

const usersDb = {
  checkIfEmailExists: () => {},
  checkIfOrganizationNameExists: () => {},
  registerAdmin: () => {},
  getUserDetailsUsingEmailAndOrganization_name: () => {},
};

const organizationsDb = {
  getOrganizationId: () => {},
};

let checkIfEmailExistsStub;
let checkIfOrganizationNameExistsStub;
let registerAdminStub;
let getUserDetailsUsingEmailAndOrganization_nameStub;
let getOrganizationIdStub;

BeforeAll(() => {
  checkIfEmailExistsStub = sandBox.stub(usersDb, "checkIfEmailExists");
  checkIfOrganizationNameExistsStub = sandBox.stub(
    usersDb,
    "checkIfOrganizationNameExists"
  );
  registerAdminStub = sandBox.stub(usersDb, "registerAdmin");
  getUserDetailsUsingEmailAndOrganization_nameStub = sandBox.stub(
    usersDb,
    "getUserDetailsUsingEmailAndOrganization_name"
  );
  getOrganizationIdStub = sandBox.stub(organizationsDb, "getOrganizationId");
});

Before(() => {
  checkIfEmailExistsStub.callsFake((args) => {
    expect(args).to.have.own.property("email");
    if (args.email == "admin@example2.com") return true;
    return false;
  });
  checkIfOrganizationNameExistsStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    if (args.organization_name == "TestOrg1") return true;
    return false;
  });
  registerAdminStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("username");
    expect(args).to.have.own.property("hash");
    expect(args).to.have.own.property("email");
  });
  getUserDetailsUsingEmailAndOrganization_nameStub.callsFake((args) => {
    expect(args).to.have.own.property("email");
    expect(args).to.have.own.property("organization_name");
    return [{ user_id: 1 }];
  });
  getOrganizationIdStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    return [{ organization_id: 1 }];
  });
});

After(() => {
  sandBox.resetHistory();
  this.organization_name = undefined;
  this.username = undefined;
  this.email = undefined;
  this.password = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "organization_name:{string}, username:{string}, email:{string}, password:{string} create-admin",
  async (organization_name, username, email, password) => {
    this.organization_name = organization_name;
    this.username = username;
    this.email = email;
    this.password = password;
  }
);

When("try to add admin", async () => {
  const addAdmin = makeAddAdmin({
    usersDb,
    organizationsDb,
    jwt: { sign: sinon.stub().returns("fake-jwt-token") },
    JWTKey: "testKey",
    crypto: {
      randomBytes: sinon.stub().returns(true),
      pbkdf2Sync: sinon.stub().returns(true),
    },
    createError,
  });

  try {
    await addAdmin(
      this.organization_name,
      this.username,
      this.email,
      this.password
    );
    this.result = "You have successfully registered.";
  } catch (err) {
    this.error = err.message;
  }
});

Then("it should return the result: {string} for add admin", async (result) => {
  expect(this.error).to.be.undefined;
  expect(this.result).be.equal(result);
});

Then("it should return the error: {string} for add admin", async (error) => {
  expect(this.error).to.be.equal(error);
});
