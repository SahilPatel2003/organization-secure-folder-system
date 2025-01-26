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

const makeRemoveFolder = require("./delete-folder");

const foldersDb = {
  getFolderDetail: () => {},
  findRolesForFolder: () => {},
  deleteFoldersFromRoles: () => {},
  findFolderUsingParentFolder: () => {},
  deleteFolder: () => {},
  removeFolderFromParentFolder: () => {},
};

let getFolderDetailStub;
let findRolesForFolderStub;
let deleteFoldersFromRolesStub;
let findFolderUsingParentFolderStub;
let deleteFolderStub;
let removeFolderFromParentFolderStub;

BeforeAll(() => {
  getFolderDetailStub = sandBox.stub(foldersDb, "getFolderDetail");
  findRolesForFolderStub = sandBox.stub(foldersDb, "findRolesForFolder");
  deleteFoldersFromRolesStub = sandBox.stub(
    foldersDb,
    "deleteFoldersFromRoles"
  );
  findFolderUsingParentFolderStub = sandBox.stub(
    foldersDb,
    "findFolderUsingParentFolder"
  );
  deleteFolderStub = sandBox.stub(foldersDb, "deleteFolder");
  removeFolderFromParentFolderStub = sandBox.stub(
    foldersDb,
    "removeFolderFromParentFolder"
  );
});

Before(() => {
  getFolderDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("folder_name");
    if (args.folder_name === "notfound") return [];
    if (args.folder_name === "a")
      return [
        {
          folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
          organization_name: "TestOrg",
          folder_name: "a",
          parent_folder: "root",
          childrens: ["76aa1dd2-9b08-479b-8a1f-ef1f972d5d51"],
        },
      ];
    return [
      {
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d51",
        organization_name: "TestOrg",
        folder_name: "b",
        parent_folder: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        childrens: [],
      },
    ];
  });

  findRolesForFolderStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    return [
      {
        role_id: "755c6251-19b7-4499-88ae-487d7e31a11d",
        organization_name: "TestOrg",
        name: "roles3",
        description: "you have this permissions",
        permissions: "1111",
        folders: "a,b",
      },
    ];
  });

  deleteFoldersFromRolesStub.callsFake((args) => {
    expect(args).to.have.own.property("updated_folders_string");
    expect(args).to.have.own.property("role_id");
  });

  findFolderUsingParentFolderStub.callsFake((args) => {
    expect(args).to.have.own.property("folderId");
    if (args.folderId === "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52") return [];
    return [
      {
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        folder_name: "b",
        parent_folder: "a",
        childrens: [],
      },
    ];
  });

  deleteFolderStub.callsFake((args) => {
    expect(args).to.have.own.property("folder_id");
  });

  removeFolderFromParentFolderStub.callsFake((args) => {
    expect(args).to.have.own.property("folder_id");
    expect(args).to.have.own.property("email");
    expect(args).to.have.own.property("parent_folder");
  });
});

After(() => {
  sandBox.resetHistory();
  this.folder_name = undefined;
  this.organization_name = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "folder_name:{string}, organization_name:{string} delete-folder",
  async (folder_name, organization_name) => {
    this.folder_name = folder_name;
    this.organization_name = organization_name;
  }
);

When("tries to delete folder", async () => {
  const removeFolder = makeRemoveFolder({
    foldersDb,
    jwt,
    createError,
    Joi,
  });

  try {
    await removeFolder(this.folder_name, this.organization_name, token);
    this.result = "Folder delted successfully.";
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for deleting the folder",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).be.equal(result);
  }
);

Then(
  "it should return the error: {string} for deleting the folder",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
