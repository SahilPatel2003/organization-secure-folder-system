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

const makeAddFile = require("./create-file");

const bucket = {
  file: () => {},
};

const foldersDb = {
  getFolderDetail: () => {},
};

const filesDb = {
  getFileDetail: () => {},
  insertFileDetails: () => {},
};

let getFolderDetailStub;
let getFileDetailStub;
let insertFileDetailsStub;
let fileStub;

BeforeAll(() => {
  getFolderDetailStub = sandBox.stub(foldersDb, "getFolderDetail");
  getFileDetailStub = sandBox.stub(filesDb, "getFileDetail");
  insertFileDetailsStub = sandBox.stub(filesDb, "insertFileDetails");
  fileStub = sandBox.stub(bucket, "file");
});

Before(() => {
  fileStub.callsFake((args) => {
    expect(args).to.match(/^[a-zA-Z0-9\/_\- ]+\.[a-zA-Z0-9]+$/);
    if (args === "images/max 427321239.png") {
      return {
        getMetadata: () => {
          return Promise.resolve([
            {
              contentType: "image/png",
              size: 25 * 1024 * 1024,
            },
          ]);
        },
      };
    }
    if (args === "ppt/Frame 427321239.ppt") {
      return {
        getMetadata: () => {
          return Promise.resolve([
            {
              contentType: "application/vnd.ms-powerpoint",
              size: 12345,
            },
          ]);
        },
      };
    }
    return {
      getMetadata: () => {
        return Promise.resolve([
          {
            contentType: "image/png",
            size: 12345,
          },
        ]);
      },
    };
  });

  getFolderDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("folder_name");
    if (args.folder_name) {
      return [
        {
          folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
          organization_name: "TestOrg",
          folder_name: "a",
          parent_folder: "root",
        },
      ];
    }

    return [];
  });

  getFileDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("file_name");
    expect(args).to.have.own.property("folder_id");
    if (args.file_name === "dublicatefile")
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
    return [];
  });

  insertFileDetailsStub.callsFake((args) => {
    expect(args).to.have.own.property("file_name");
    expect(args).to.have.own.property("folder_id");
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("size");
    expect(args).to.have.own.property("type");
    expect(args).to.have.own.property("path");
    expect(args).to.have.own.property("created_by");
  });
});

After(() => {
  sandBox.resetHistory();
  this.file_name = undefined;
  this.path = undefined;
  this.parent_folder = undefined;
  this.organization_name = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "file_name:{string}, path:{string}, parent_folder:{string}, organization_name:{string} create-file",
  async (file_name, path, parent_folder, organization_name) => {
    this.file_name = file_name;
    this.path = path;
    this.parent_folder = parent_folder;
    this.organization_name = organization_name;
  }
);

When("tries to create file", async () => {
  const addFile = makeAddFile({
    filesDb,
    foldersDb,
    jwt,
    bucket,
    createError,
  });

  try {
    await addFile(
      this.file_name,
      this.path,
      this.parent_folder,
      this.organization_name,
      token
    );
    this.result = "file created successfully.";
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for creating file",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).be.equal(result);
  }
);

Then(
  "it should return the error: {string} for creating file",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
