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
const makeTakePermissionFromAdmin = require("./take-permission-from-admin");
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

const usersDb = {
  getAssignedUserEmailAndUsername: () => {},
};

const rolesDb = {
  getRoleDetail: () => {},
};

const organizationsDb = {
  getAdminName: () => {},
};

let getAssignedUserEmailAndUsernameStub;
let getRoleDetailStub;
let getAdminNameStub;

BeforeAll(() => {
  getAssignedUserEmailAndUsernameStub = sandBox.stub(
    usersDb,
    "getAssignedUserEmailAndUsername"
  );
  getRoleDetailStub = sandBox.stub(rolesDb, "getRoleDetail");
  getAdminNameStub = sandBox.stub(organizationsDb, "getAdminName");
});

Before(() => {
  getAssignedUserEmailAndUsernameStub.callsFake((args) => {
    expect(args).to.have.own.property("assigned_user_id");
    if (args.assigned_user_id === "8edab200-3f19-4f2e-9178-c3626d063477")
      return [];
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

  getRoleDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("role_id");
    if (args.role_id == "755c6251-19b7-4499-88ae-487d7e31a111") return [];
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

  getAdminNameStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    return [
      {
        created_by: "TestOrg@gmail.com",
      },
    ];
  });
});

After(() => {
  sandBox.resetHistory();
  this.assigned_user_id = undefined;
  this.role_id = undefined;
  this.expiration_time = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "assigned_user_id:{string}, role_id:{string}, expiration_time:{string} take-permission-from-admin",
  async (assigned_user_id, role_id, expiration_time) => {
    this.assigned_user_id = assigned_user_id;
    this.role_id = role_id;
    this.expiration_time = expiration_time;
  }
);

When(
  "the user tries to send an email to the admin to change the role of another user",
  async () => {
    const takePermissionFromAdmin = makeTakePermissionFromAdmin({
      rolesDb,
      organizationsDb,
      usersDb,
      jwt: { sign: sinon.stub().returns("fake-token"), decode: jwt.decode },
      JWTKey,
      nodemailer,
      createError,
      Joi,
    });

    try {
      await takePermissionFromAdmin(
        this.assigned_user_id,
        this.role_id,
        this.expiration_time,
        token
      );
      this.result = "Permission request sent successfully to the admin.";
    } catch (err) {
      this.error = err.message;
    }
  }
);

Then(
  "it should return the result: {string} for sending mail",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).be.equal(result);
  }
);

Then("it should return the error: {string} for sending mail", async (error) => {
  expect(this.error).to.be.equal(error);
});
