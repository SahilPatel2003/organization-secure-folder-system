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
const Joi = require("joi");

const makeMoveFolder = require("./move-folder");

const usersDb = {
  getUserDetail: () => {},
};

const rolesDb = {
  getRoleIdFromRole_assignmentTableUsingUser_id: () => {},
  getRoleDetail: () => {},
  deleteFolderFromRoleTableMovedByUserBecauseOnlyReadPermissionAssignedToFolder:
    () => {},
};

const foldersDb = {
  getFolderDetail: () => {},
  removeFolderFromParentFolder: () => {},
  addFolderAsChildIntoDestinationParentFolder: () => {},
  setDestinationParentFolderForMovedFolder: () => {},
  getFolderDetailUsingId: () => {},
};

let getUserDetailStub;
let getRoleIdFromRole_assignmentTableUsingUser_idStub;
let getRoleDetailStub;
let deleteFolderFromRoleTableMovedByUserBecauseOnlyReadPermissionAssignedToFolderStub;
let getFolderDetailStub;
let removeFolderFromParentFolderStub;
let addFolderAsChildIntoDestinationParentFolderStub;
let setDestinationParentFolderForMovedFolderStub;
let getFolderDetailUsingIdStub;

BeforeAll(() => {
  getUserDetailStub = sandBox.stub(usersDb, "getUserDetail");
  getRoleIdFromRole_assignmentTableUsingUser_idStub = sandBox.stub(
    rolesDb,
    "getRoleIdFromRole_assignmentTableUsingUser_id"
  );
  getRoleDetailStub = sandBox.stub(rolesDb, "getRoleDetail");
  deleteFolderFromRoleTableMovedByUserBecauseOnlyReadPermissionAssignedToFolderStub =
    sandBox.stub(
      rolesDb,
      "deleteFolderFromRoleTableMovedByUserBecauseOnlyReadPermissionAssignedToFolder"
    );
  getFolderDetailStub = sandBox.stub(foldersDb, "getFolderDetail");
  removeFolderFromParentFolderStub = sandBox.stub(
    foldersDb,
    "removeFolderFromParentFolder"
  );
  addFolderAsChildIntoDestinationParentFolderStub = sandBox.stub(
    foldersDb,
    "addFolderAsChildIntoDestinationParentFolder"
  );
  setDestinationParentFolderForMovedFolderStub = sandBox.stub(
    foldersDb,
    "setDestinationParentFolderForMovedFolder"
  );
  getFolderDetailUsingIdStub = sandBox.stub(
    foldersDb,
    "getFolderDetailUsingId"
  );
});

Before(() => {
  getUserDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("user_id");
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
  });

  getRoleIdFromRole_assignmentTableUsingUser_idStub.callsFake((args) => {
    expect(args).to.have.own.property("user_id");

    return [
      {
        role_id: "866c6251-19b7-4499-88ae-487d7e31a11d",
      },
    ];
  });

  getRoleDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("role_id");
    return [
      {
        role_id: "755c6251-19b7-4499-88ae-487d7e31a11d",
        organization_name: "TestOrg",
        name: "roles3",
        description: "you have this permissions",
        permissions: "1111",
        folders: "c",
      },
    ];
  });

  deleteFolderFromRoleTableMovedByUserBecauseOnlyReadPermissionAssignedToFolderStub.callsFake(
    (args) => {
      expect(args).to.have.own.property("updated_folders");
      expect(args).to.have.own.property("role_id");
    }
  );

  getFolderDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("folder_name");
    if (args.folder_name === "sourceFolderNotFound") return [];
    if (args.folder_name === "destinationFolderNotFound") return [];
    return [
      {
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        folder_name: "a",
        parent_folder: "root",
      },
    ];
  });

  removeFolderFromParentFolderStub.callsFake((args) => {
    expect(args).to.have.own.property("folder_id");
    expect(args).to.have.own.property("email");
    expect(args).to.have.own.property("parent_folder");
  });

  addFolderAsChildIntoDestinationParentFolderStub.callsFake((args) => {
    expect(args).to.have.own.property("source_folder_id");
    expect(args).to.have.own.property("email");
    expect(args).to.have.own.property("destination_folder_id");
  });

  setDestinationParentFolderForMovedFolderStub.callsFake((args) => {
    expect(args).to.have.own.property("destination_folder_id");
    expect(args).to.have.own.property("email");
    expect(args).to.have.own.property("source_folder_id");
  });

  getFolderDetailUsingIdStub.callsFake((args) => {
    expect(args).to.have.own.property("folder_id");
    return [
      {
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        folder_name: "a",
        parent_folder: "root",
      },
    ];
  });
});

After(() => {
  sandBox.resetHistory();
  this.source_folder_name = undefined;
  this.destination_folder_name = undefined;
  this.organization_name = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "source_folder_name:{string}, destination_folder_name:{string}, organization_name:{string} move-folder",
  async (source_folder_name, destination_folder_name, organization_name) => {
    this.source_folder_name = source_folder_name;
    this.destination_folder_name = destination_folder_name;
    this.organization_name = organization_name;
  }
);

When("tries to move folder", async () => {
  const moveFolderByUser = makeMoveFolder({
    foldersDb,
    rolesDb,
    usersDb,
    jwt,
    createError,
    Joi,
  });

  try {
    await moveFolderByUser(
      this.source_folder_name,
      this.destination_folder_name,
      this.organization_name,
      token
    );
    this.result = "folder was moved successfully.";
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for moving folder",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).be.equal(result);
  }
);

Then(
  "it should return the error: {string} for moving folder",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
