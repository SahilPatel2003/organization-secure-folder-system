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
const makeroleChangeOfUser = require("./change-user-role");
const jwt = require("jsonwebtoken");
const { token } = require("../../utils/token");
const createError = require("../../utils/create-error");

const Joi = require("joi");

const usersDb = {
  getUserDetail: () => {},
  updateRoleOfUserByAdmin: () => {},
};

const rolesDb = {
  getRoleDetail: () => {},
};

let getUserDetailStub;
let updateRoleOfUserByAdminStub;
let getRoleDetailStub;

BeforeAll(() => {
  getUserDetailStub = sandBox.stub(usersDb, "getUserDetail");
  updateRoleOfUserByAdminStub = sandBox.stub(
    usersDb,
    "updateRoleOfUserByAdmin"
  );
  getRoleDetailStub = sandBox.stub(rolesDb, "getRoleDetail");
});

Before(() => {
  getUserDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("user_id");
    if (args.user_id === "f821e8ee-4a66-438a-be7c-c36890413e22") return [];
    return [
      {
        user_id: "c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf",
        organization_name: "TestOrg",
        role_id: null,
        username: "test_123",
        email: "test@gmail.com",
      },
    ];
  });

  updateRoleOfUserByAdminStub.callsFake((args) => {
    expect(args).to.have.own.property("user_id");
    expect(args).to.have.own.property("role_id");
  });

  getRoleDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("role_id");
    if (args.role_id === "8edab200-3f19-4f2e-9178-c3626d063471") return [];
    return [
      {
        role_id: "755c6251-19b7-4499-88ae-487d7e31a11d",
        organization_name: "TestOrg",
        name: "roles3",
        description: "you have this permissions",
        permissions: "1111",
        folders: "c",
        created_at: "2024-05-31T08:32:38.000Z",
        modified_at: null,
        created_by: "c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf",
      },
    ];
  });
});

After(() => {
  sandBox.resetHistory();
  this.assigned_user_id = undefined;
  this.role_id = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "assigned_user_id:{string}, role_id:{string}, change-user-role",
  async (assigned_user_id, role_id) => {
    this.assigned_user_id = assigned_user_id;
    this.role_id = role_id;
  }
);

When("the admin change the role", async () => {
  const roleChangeOfUser = makeroleChangeOfUser({
    usersDb,
    rolesDb,
    createError,
    Joi,
  });

  try {
    await roleChangeOfUser(this.assigned_user_id, this.role_id, token);
    this.result = "User role updated successfully.";
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for changing role",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).be.equal(result);
  }
);

Then(
  "it should return the error: {string} for changing role",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
