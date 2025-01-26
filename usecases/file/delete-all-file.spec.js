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

const makeRemoveAllFiles = require("./delete-all-file");

const foldersDb = {
  getFolderDetail: () => {},
};

const filesDb = {
  deleteAllFiles: () => {},
};

let getFolderDetailStub;
let deleteAllFilesStub;

BeforeAll(() => {
  getFolderDetailStub = sandBox.stub(foldersDb, "getFolderDetail");
  deleteAllFilesStub = sandBox.stub(filesDb, "deleteAllFiles");
});

Before(() => {
  getFolderDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("folder_name");
    if (args.folder_name === "notFound") return [];
    return [
      {
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        folder_name: "a",
        parent_folder: "root",
      },
    ];
  });

  deleteAllFilesStub.callsFake((args) => {
    expect(args).to.have.own.property("folder_id");
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
  "folder_name:{string}, organization_name:{string} delete-all-file",
  async (folder_name, organization_name) => {
    this.folder_name = folder_name;
    this.organization_name = organization_name;
  }
);

When("tries to delete all file", async () => {
  const removeAllFile = makeRemoveAllFiles({
    filesDb,
    foldersDb,
    createError,
    Joi,
  });

  try {
    await removeAllFile(this.folder_name, this.organization_name);
    this.result = "All files were deleted successfully.";
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for deleting all file",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).be.equal(result);
  }
);

Then(
  "it should return the error: {string} for deleting all file",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
