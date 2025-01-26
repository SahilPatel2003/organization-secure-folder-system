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

const makeFindFolderFiles = require("./find-folder-files");

const filesDb = {
  getFolderFiles: () => {},
};

const foldersDb = {
  getFolderDetail: () => {},
};

const organizationsDb = {
  getOrganizationDetail: () => {},
};

let getFolderDetailStub;
let getOrganizationDetailStub;
let getFolderFilesStub;

BeforeAll(() => {
  getOrganizationDetailStub = sandBox.stub(
    organizationsDb,
    "getOrganizationDetail"
  );
  getFolderDetailStub = sandBox.stub(foldersDb, "getFolderDetail");
  getFolderFilesStub = sandBox.stub(filesDb, "getFolderFiles");
});

Before(() => {
  getOrganizationDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    if (args.organization_name === "notFound") return [];
    return [
      {
        organization_id: "f821e8ee-4a66-438a-be7c-c36890413e2d",
        organization_name: "TestOrg",
        created_by: "test@gmail.com",
        created_at: "2024-05-31T08:26:06.000Z",
      },
    ];
  });

  getFolderDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("folder_name");
    expect(args).to.have.own.property("organization_name");
    if (args.folder_name === "notFound") return [];
    if (args.folder_name === "nofiles")
      return [
        {
          folder_id: "99aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
          organization_name: "TestOrg",
          folder_name: "a",
          parent_folder: "root",
          childrens: ["d0b7459d-baba-4e6c-a04a-eedb46ec3119"],
          created_at: "2024-06-02T05:06:45.000Z",
          created_by: "c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf",
          modified_at: "2024-06-02T05:06:58.000Z",
          modified_by: "test@gmail.com",
        },
      ];
    return [
      {
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        folder_name: "a",
        parent_folder: "root",
        childrens: ["d0b7459d-baba-4e6c-a04a-eedb46ec3119"],
        created_at: "2024-06-02T05:06:45.000Z",
        created_by: "c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf",
        modified_at: "2024-06-02T05:06:58.000Z",
        modified_by: "test@gmail.com",
      },
    ];
  });

  getFolderFilesStub.callsFake((args) => {
    expect(args).to.have.own.property("folder_id");
    if (args.folder_id === "99aa1dd2-9b08-479b-8a1f-ef1f972d5d52") return [];
    return [
      {
        file_id: "d618f0e1-99f7-4d84-8fa0-9841a3432647",
        file_name: "firebase",
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        size: 125223,
        type: "image/png",
        path: "images/Frame 427321239.png",
        created_at: "2024-06-03T06:45:42.000Z",
        created_by: "c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf",
        modified_at: "2024-06-04T06:45:42.000Z",
        modified_by: "c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf",
      },
      {
        file_id: "d618f0e1-99f7-4d84-8fa0-9841a3432647",
        file_name: "google",
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        size: 125223,
        type: "image/png",
        path: "images/Frame 427321239.png",
        created_at: "2024-06-03T06:45:42.000Z",
        created_by: "c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf",
        modified_at: "2024-06-04T06:45:42.000Z",
        modified_by: "c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf",
      },
    ];
  });
});

After(() => {
  sandBox.resetHistory();
  this.organization_name = undefined;
  this.folder_name = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "organization_name:{string}, folder_name:{string} get-folder-files",
  async (organization_name, folder_name) => {
    this.organization_name = organization_name;
    this.folder_name = folder_name;
  }
);

When("tries to get folder files details", async () => {
  const findFolderFiles = makeFindFolderFiles({
    filesDb,
    foldersDb,
    organizationsDb,
    createError,
    Joi,
  });

  try {
    this.result = await findFolderFiles(
      this.organization_name,
      this.folder_name
    );
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for getting all file details of folder",
  async (expectedResult) => {
    const expected = JSON.parse(expectedResult);
    expect(this.error).to.be.undefined;
    expect(this.result).to.deep.equal(expected);
  }
);

Then(
  "it should return the error: {string} for getting all file details of folder",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
