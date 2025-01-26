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
const { token } = require("../../utils/token");
const createError = require("../../utils/create-error");
const JWTKey = "fake";
const nodemailer = {
  createTransport: sinon
    .stub()
    .returns({ sendMail: sinon.stub().returns(true) }),
};
const Joi = require("joi");

const makeFindAllRolesDetails = require("./find-all-role-details");

const rolesDb = {
  getAllRolesDetail: () => {},
};

const organizationsDb = {
  getAdminName: () => {},
};

let getAllRolesDetailStub;
let getAdminNameStub;

BeforeAll(() => {
  getAllRolesDetailStub = sandBox.stub(rolesDb, "getAllRolesDetail");
  getAdminNameStub = sandBox.stub(organizationsDb, "getAdminName");
});

Before(() => {
  getAdminNameStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    if (args.organization_name === "TestOrg1") return [];
    return [
      {
        created_by: "test",
      },
    ];
  });

  getAllRolesDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    if (args.organization_name === "NoRoles") return [];
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
  this.organization_name = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "organization_name:{string} get-all-role-details",
  async (organization_name) => {
    this.organization_name = organization_name;
  }
);

When("tries to get all roles details", async () => {
  const findAllRolesDetails = makeFindAllRolesDetails({
    rolesDb,
    organizationsDb,
    createError,
    Joi,
  });

  try {
    this.result = await findAllRolesDetails(this.organization_name);
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for getting all roles details",
  async (expectedResult) => {
    const expected = JSON.parse(expectedResult);
    expect(this.error).to.be.undefined;
    expect(this.result).to.deep.equal(expected);
  }
);

Then(
  "it should return the error: {string} for getting all roles details",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
