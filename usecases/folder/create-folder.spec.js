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

const makeAddFolder = require("./create-folder");

const foldersDb = {
  getFolderDetail: () => {},
  insertFolderDetails: () => {},
  addFolderAsChildrenIntoParent: () => {},
  getFolderDetailAfterCreated: () => {},
  getParentFolderDetail: () => {},
};

let getFolderDetailStub;
let insertFolderDetailsStub;
let addFolderAsChildrenIntoParentStub;
let getFolderDetailAfterCreatedStub;
let getParentFolderDetailStub;

BeforeAll(() => {
  getFolderDetailStub = sandBox.stub(foldersDb, "getFolderDetail");
  insertFolderDetailsStub = sandBox.stub(foldersDb, "insertFolderDetails");
  addFolderAsChildrenIntoParentStub = sandBox.stub(
    foldersDb,
    "addFolderAsChildrenIntoParent"
  );
  getFolderDetailAfterCreatedStub = sandBox.stub(
    foldersDb,
    "getFolderDetailAfterCreated"
  );
  getParentFolderDetailStub = sandBox.stub(foldersDb, "getParentFolderDetail");
});

Before(() => {
  getFolderDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("folder_name");
    expect(args).to.have.own.property("organization_name");
    if (args.folder_name === "dublicate")
      return [
        {
          folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
          organization_name: "TestOrg",
          folder_name: "dublicate",
          parent_folder: "root",
        },
      ];

    return [];
  });

  getFolderDetailAfterCreatedStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("folder_name");
    return [
      {
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        folder_name: "b",
        parent_folder: "89aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
      },
    ];
  });

  getParentFolderDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("parent_folder");
    if (args.parent_folder === "e") return [];
    return [
      {
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        folder_name: "a",
        parent_folder: "root",
      },
    ];
  });

  insertFolderDetailsStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("folder_name");
    expect(args).to.have.own.property("parent_folder");
    expect(args).to.have.own.property("childrens");
    expect(args).to.have.own.property("created_by");
  });

  addFolderAsChildrenIntoParentStub.callsFake((args) => {
    expect(args).to.have.own.property("folder_id");
    expect(args).to.have.own.property("email");
    expect(args).to.have.own.property("parent_folder_id");
  });
});

After(() => {
  sandBox.resetHistory();
  this.folder_name = undefined;
  this.parent_folder = undefined;
  this.organization_name = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "folder_name:{string}, parent_folder:{string}, organization_name:{string} create-folder",
  async (folder_name, parent_folder, organization_name) => {
    this.folder_name = folder_name;
    this.parent_folder = parent_folder;
    this.organization_name = organization_name;
  }
);

When("tries to create folder", async () => {
  const addFolder = makeAddFolder({
    foldersDb,
    jwt,
    createError,
  });

  try {
    await addFolder(
      this.folder_name,
      this.parent_folder,
      this.organization_name,
      token
    );
    this.result = "Folder created successfully.";
  } catch (err) {
    this.error = err.message;
  }
});
let i;
Then(
  "it should return the result: {string} for creating the folder",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).be.equal(result);
  }
);

Then(
  "it should return the error: {string} for creating the folder",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
