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
const JWTKey = "fake";

const Joi = require("joi");

const jwt = {
  verify: () => {},
  decode: () => {},
};

const makeCheckPermission = require("./check-permission");

const usersDb = {
  getUserDetail: () => {},
};

const rolesDb = {
  deleteExpiredTimeRolesFromRole_assignmentTable: () => {},
  getRoleDetail: () => {},
  getRoleIdFromRole_assignmentTableUsingUser_id: () => {},
};

const foldersDb = {
  getFolderDetail: () => {},
  getFolderDetailUsingId: () => {},
};

let getUserDetail;
let deleteExpiredTimeRolesFromRole_assignmentTable;
let getRoleDetail;
let getRoleIdFromRole_assignmentTableUsingUser_id;
let getFolderDetail;
let getFolderDetailUsingId;
let verifyStub;
let decodeStub;

BeforeAll(() => {
  getUserDetail = sandBox.stub(usersDb, "getUserDetail");
  deleteExpiredTimeRolesFromRole_assignmentTable = sandBox.stub(
    rolesDb,
    "deleteExpiredTimeRolesFromRole_assignmentTable"
  );
  getRoleDetail = sandBox.stub(rolesDb, "getRoleDetail");
  getRoleIdFromRole_assignmentTableUsingUser_id = sandBox.stub(
    rolesDb,
    "getRoleIdFromRole_assignmentTableUsingUser_id"
  );
  getFolderDetail = sandBox.stub(foldersDb, "getFolderDetail");
  getFolderDetailUsingId = sandBox.stub(foldersDb, "getFolderDetailUsingId");
  verifyStub = sandBox.stub(jwt, "verify");
  decodeStub = sandBox.stub(jwt, "decode");
});

Before(() => {
  verifyStub.callsFake((token, JWTKey, callback) => {
    if (token) token = JSON.parse(token);
    if (token.user_id === "f821e8ee-4a66-438a-be7c-c36890413e22")
      callback(new Error("Invalid token"));
    else callback(null, true);
  });

  decodeStub.callsFake((args) => {
    return JSON.parse(this.token);
  });

  getUserDetail.callsFake((args) => {
    expect(args).to.have.own.property("user_id");
    if (args.user_id === "ff21e8ee-4a66-438a-be7c-c36890413e2d")
      return [
        {
          user_id: "c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf",
          organization_name: "TestOrg",
          role_id: null,
          username: "test_123",
          email: "test@gmail.com",
          hash: "false",
          salt: "false",
          is_admin: 0,
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
        hash: "false",
        salt: "false",
        is_admin: 1,
        user_status: 1,
      },
    ];
  });

  deleteExpiredTimeRolesFromRole_assignmentTable.callsFake((args) => {});

  getRoleDetail.callsFake((args) => {
    expect(args).to.have.own.property("role_id");
    if (args.role_id === "225c6251-19b7-4499-88ae-487d7e31a11d")
      return [
        {
          role_id: "755c6251-19b7-4499-88ae-487d7e31a11d",
          organization_name: "TestOrg",
          name: "roles3",
          description: "you have this permissions",
          permissions: "0001",
          folders: "c",
        },
      ];
    if (args.role_id === "335c6251-19b7-4499-88ae-487d7e31a11d")
      return [
        {
          role_id: "755c6251-19b7-4499-88ae-487d7e31a11d",
          organization_name: "TestOrg",
          name: "roles3",
          description: "you have this permissions",
          permissions: "1001",
          folders: "c",
        },
      ];
    if (args.role_id === "445c6251-19b7-4499-88ae-487d7e31a11d")
      return [
        {
          role_id: "755c6251-19b7-4499-88ae-487d7e31a11d",
          organization_name: "TestOrg",
          name: "roles3",
          description: "you have this permissions",
          permissions: "0101",
          folders: "c",
        },
      ];
    if (args.role_id === "222c6251-19b7-4499-88ae-487d7e31a11d")
      return [
        {
          role_id: "755c6251-19b7-4499-88ae-487d7e31a11d",
          organization_name: "TestOrg",
          name: "roles3",
          description: "you have this permissions",
          permissions: "0011",
          folders: "c",
        },
      ];
    if (args.role_id === "22226251-19b7-4499-88ae-487d7e31a11d")
      return [
        {
          role_id: "755c6251-19b7-4499-88ae-487d7e31a11d",
          organization_name: "TestOrg",
          name: "roles3",
          description: "you have this permissions",
          permissions: "1011",
          folders: "c",
        },
      ];
  });

  getRoleIdFromRole_assignmentTableUsingUser_id.callsFake((args) => {
    expect(args).to.have.own.property("user_id");
    return [];
  });

  getFolderDetail.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("folder_name");

    if (args.folder_name === "notFound") return [];
    return [
      {
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        folder_name: "c",
        parent_folder: "root",
        childrens: ["d0b7459d-baba-4e6c-a04a-eedb46ec3119"],
      },
    ];
  });

  getFolderDetailUsingId.callsFake((args) => {
    expect(args).to.have.own.property("folder_id");
    return [
      {
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        folder_name: "c",
        parent_folder: "root",
        childrens: ["d0b7459d-baba-4e6c-a04a-eedb46ec3119"],
      },
    ];
  });
});

After(() => {
  sandBox.resetHistory();
  this.path = undefined;
  this.token = undefined;
  this.data = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "path:{string}, token:{string}, data:{string} check-permissions",
  async (path, token, data) => {
    this.path = path;
    this.token = token;
    this.data = data;
  }
);

When("tries to verify user", async () => {
  const checkPermission = makeCheckPermission({
    usersDb,
    foldersDb,
    rolesDb,
    jwt,
    JWTKey: "fake",
    createError,
    Joi,
  });

  try {
    if (this.data) this.data = JSON.parse(this.data);
    await checkPermission(this.path, this.token, this.data);
    this.result = "User verified successfully.";
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for verified user",
  async (expectedResult) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.deep.equal(expectedResult);
  }
);

Then(
  "it should return the error: {string} for unverify user",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
