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

const createError = require("../../utils/create-error");

const Joi = require("joi");

const makeFindRoleDetails = require("./find-role-detail");

const rolesDb = {
  getRoleDetail: () => {},
};

let getRoleDetailStub;

BeforeAll(() => {
  getRoleDetailStub = sandBox.stub(rolesDb, "getRoleDetail");
});

Before(() => {
  getRoleDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("role_id");
    if (args.role_id === "99dab200-3f19-4f2e-9178-c3626d06347b") return [];
    return [
      {
        role_id: "755c6251-19b7-4499-88ae-487d7e31a11d",
        organization_name: "TestOrg",
        name: "roles3",
        description: "you have this permissions",
        permissions: "1111",
        folders: "c",
        created_at: "2024-05-31T08:32:38.000Z",
        modified_at: "2024-06-01T08:32:38.000Z",
        created_by: "c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf",
      },
    ];
  });
});

After(() => {
  sandBox.resetHistory();
  this.role_id = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given("role_id:{string} to  get-role-detail", async (role_id) => {
  this.role_id = role_id;
});

When("tries to get role details", async () => {
  const findRoleDetails = makeFindRoleDetails({
    rolesDb,
    createError,
    Joi,
  });

  try {
    const result = await findRoleDetails(this.role_id);
    this.result = result;
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for getting role details",
  async (expectedResult) => {
    this.result = JSON.stringify(this.result);
    expect(this.error).to.be.undefined;
    expect(this.result).to.equal(expectedResult);
  }
);

Then(
  "it should return the error: {string} for getting role details",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
