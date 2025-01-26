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

const makeRemoveFile = require("./delete-file");

const foldersDb = {
  getFolderDetail: () => {},
};

const filesDb = {
  getFileDetail: () => {},
  deleteFile: () => {},
};

let getFolderDetailStub;
let getFileDetailStub;
let deleteFileStub;

BeforeAll(() => {
  getFolderDetailStub = sandBox.stub(foldersDb, "getFolderDetail");
  getFileDetailStub = sandBox.stub(filesDb, "getFileDetail");
  deleteFileStub = sandBox.stub(filesDb, "deleteFile");
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

  getFileDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("file_name");
    expect(args).to.have.own.property("folder_id");
    if (args.file_name === "fileNotFound") return [];
    return [
      {
        file_id: "d618f0e1-99f7-4d84-8fa0-9841a3432647",
        file_name: "firebase",
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        size: 125223,
        type: "image/png",
        path: "images/Frame 427321239.png",
      },
    ];
  });

  deleteFileStub.callsFake((args) => {
    expect(args).to.have.own.property("file_name");
    expect(args).to.have.own.property("folder_id");
  });
});

After(() => {
  sandBox.resetHistory();
  this.file_name = undefined;
  this.folder_name = undefined;
  this.organization_name = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "file_name:{string}, folder_name:{string}, organization_name:{string} delete-file",
  async (file_name, folder_name, organization_name) => {
    this.file_name = file_name;
    this.folder_name = folder_name;
    this.organization_name = organization_name;
  }
);

When("tries to delete file", async () => {
  const removeFile = makeRemoveFile({
    filesDb,
    foldersDb,
    createError,
    Joi,
  });

  try {
    await removeFile(this.file_name, this.folder_name, this.organization_name);
    this.result = "file was deleted successfully.";
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for deleting file",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).be.equal(result);
  }
);

Then(
  "it should return the error: {string} for deleting file",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
