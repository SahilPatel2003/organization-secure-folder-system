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

const makeMoveFile = require("./move-file");

const foldersDb = {
  getFolderDetail: () => {},
};

const filesDb = {
  moveFileFromFolder: () => {},
};

let getFolderDetail;
let moveFileFromFolder;

BeforeAll(() => {
  getFolderDetail = sandBox.stub(foldersDb, "getFolderDetail");
  moveFileFromFolder = sandBox.stub(filesDb, "moveFileFromFolder");
});

Before(() => {
  getFolderDetail.callsFake((args) => {
    expect(args).to.have.own.property("folder_name");
    expect(args).to.have.own.property("organization_name");
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

  moveFileFromFolder.callsFake((args) => {
    expect(args).to.have.own.property("destination_folder_id");
    expect(args).to.have.own.property("user_id");
    expect(args).to.have.own.property("file_name");
    expect(args).to.have.own.property("source_folder_id");
  });
});

After(() => {
  sandBox.resetHistory();
  this.file_name = undefined;
  this.destination_folder = undefined;
  this.organization_name = undefined;
  this.source_folder_name = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "file_name:{string}, destination_folder:{string}, organization_name:{string}, source_folder_name:{string} move-file",
  async (
    file_name,
    destination_folder,
    organization_name,
    source_folder_name
  ) => {
    this.file_name = file_name;
    this.destination_folder = destination_folder;
    this.organization_name = organization_name;
    this.source_folder_name = source_folder_name;
  }
);

When("tries to move file", async () => {
  const moveFile = makeMoveFile({
    filesDb,
    foldersDb,
    jwt,
    createError,
    Joi,
  });

  try {
    await moveFile(
      this.file_name,
      this.destination_folder,
      this.organization_name,
      this.source_folder_name,
      token
    );
    this.result = "File was moved successfully.";
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for moving file",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).be.equal(result);
  }
);

Then("it should return the error: {string} for moving file", async (error) => {
  expect(this.error).to.be.equal(error);
});
