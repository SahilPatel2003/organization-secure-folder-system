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
const makeAddRole = require("./add-roles");
const jwt = require("jsonwebtoken");
const { token } = require("../../utils/token");

const rolesDb = {
  addRole: () => {},
};

let addRoleStub;

BeforeAll(() => {
  addRoleStub = sandBox.stub(rolesDb, "addRole");
});

Before(() => {
  addRoleStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("name");
    expect(args).to.have.own.property("description");
    expect(args).to.have.own.property("permissions");
    expect(args).to.have.own.property("folders");
    expect(args).to.have.own.property("created_by");
  });
});

After(() => {
  sandBox.resetHistory();
  this.name = undefined;
  this.description = undefined;
  this.permissions = undefined;
  this.folders = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "name:{string}, description:{string}, permissions:{string}, folders:{string} add-role",
  async (name, description, permissions, folders) => {
    this.name = name;
    this.description = description;
    this.permissions = permissions;
    this.folders = folders;
  }
);

When("the admin create role", async () => {
  const addRole = makeAddRole({
    rolesDb,
    jwt,
  });

  try {
    await addRole(
      this.name,
      this.description,
      this.permissions,
      this.folders,
      token
    );
    this.result = "Role added successfully.";
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for creating role",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).be.equal(result);
  }
);

Then(
  "it should return the error: {string} for creating role",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
