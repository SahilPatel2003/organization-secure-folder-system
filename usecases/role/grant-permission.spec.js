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
const jwt = require("jsonwebtoken");
const { token1 } = require("../../utils/token");
const createError = require("../../utils/create-error");

const makeGrantPermission = require("./grant-permission");

const rolesDb = {
  assignedRoleDetail: () => {},
};

let assignedRoleDetailStub;

BeforeAll(() => {
  assignedRoleDetailStub = sandBox.stub(rolesDb, "assignedRoleDetail");
});

Before(() => {
  assignedRoleDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("assigned_user_id");
    expect(args).to.have.own.property("user_id");
    expect(args).to.have.own.property("role_id");
    expect(args).to.have.own.property("expiration_time");
    expect(args).to.have.own.property("organization_name");
    if (this.url === "grantpermissionurl1")
      throw createError(401, "Invalid token.");
  });
});

After(() => {
  sandBox.resetHistory();
  this.url = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given("url:{string}, grant-permission", async (url) => {
  this.url = url;
});

When("the admin grants permission", async () => {
  const grantPermissionByAdmin = makeGrantPermission({
    rolesDb,
    jwt: { verify: sinon.stub(), decode: jwt.decode },
    JWTKey: "fake",
    url: { parse: sinon.stub().returns({ query: { token: token1 } }) },
    createError,
  });

  try {
    await grantPermissionByAdmin(this.url);
    this.result = "Role assigned successfully.";
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for granting permission",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).be.equal(result);
  }
);

Then(
  "it should return the error: {string} for granting permission",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
