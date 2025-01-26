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

const makeFindAllUsersFromOrganization = require("./find-all-users-from-organization");

const organizationsDb = {
  getAdminName: () => {},
  getAllUsersFromOrganization: () => {},
};

let getAdminNameStub;
let getAllUsersFromOrganizationStub;

BeforeAll(() => {
  getAdminNameStub = sandBox.stub(organizationsDb, "getAdminName");
  getAllUsersFromOrganizationStub = sandBox.stub(
    organizationsDb,
    "getAllUsersFromOrganization"
  );
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

  getAllUsersFromOrganizationStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    return [
      {
        user_id: "8a21822b-df66-42d5-90df-fa7b2bfdb589",
        organization_name: "TestOrg",
        role_id: "755c6251-19b7-4499-88ae-487d7e31a11d",
        username: "ass",
        email: "mandanisahil@gmail.com",
        is_admin: 1,
        user_status: 0,
        created_at: "2024-06-01T09:21:03.000Z",
        created_by: "c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf",
        invitation_accepted_at: "2024-06-0T09:21:03.000Z",
        modified_at: "2024-06-01T09:21:03.000Z",
      },
      {
        user_id: "8a21822b-df66-42d5-90df-fa7b2bfdb589",
        organization_name: "TestOrg",
        role_id: "755c6251-19b7-4499-88ae-487d7e31a11d",
        username: "nayan",
        email: "mandanisahil@gmail.com",
        is_admin: 0,
        user_status: 0,
        created_at: "2024-06-01T09:21:03.000Z",
        created_by: "c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf",
        invitation_accepted_at: "2024-06-0T09:21:03.000Z",
        modified_at: "2024-06-01T09:21:03.000Z",
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
  "organization_name:{string} get all users from organization",
  async (organization_name) => {
    this.organization_name = organization_name;
  }
);

When("tries to get all users form organization", async () => {
  const findAllUsersFromOrganization = makeFindAllUsersFromOrganization({
    organizationsDb,
    createError,
    Joi,
  });

  try {
    this.result = await findAllUsersFromOrganization(this.organization_name);
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for getting all users from organization",
  async (expectedResult) => {
    const expected = JSON.parse(expectedResult);
    expect(this.error).to.be.undefined;
    expect(this.result).to.deep.equal(expected);
  }
);

Then(
  "it should return the error: {string} for getting all users from organization",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
