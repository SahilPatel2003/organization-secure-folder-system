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

const makeFindFileName = require("./find-file-name");

const filesDb = {
  getTotalCountOfFiles: () => {},
  searchFileNameWithOrganization: () => {},
  getRangeFilesFromOrganization: () => {},
};

const organizationsDb = {
  getAdminName: () => {},
};

let getTotalCountOfFilesStub;
let getRangeFilesFromOrganizationStub;
let searchFileNameWithOrganizationStub;
let getAdminNameStub;

BeforeAll(() => {
  getTotalCountOfFilesStub = sandBox.stub(filesDb, "getTotalCountOfFiles");
  searchFileNameWithOrganizationStub = sandBox.stub(
    filesDb,
    "searchFileNameWithOrganization"
  );
  getRangeFilesFromOrganizationStub = sandBox.stub(
    filesDb,
    "getRangeFilesFromOrganization"
  );
  getAdminNameStub = sandBox.stub(organizationsDb, "getAdminName");
});

Before(() => {
  getAdminNameStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    if (args.organization_name === "TestOrg1") return [];
    return [
      {
        created_by: "test",
      },
    ];
  });

  getRangeFilesFromOrganizationStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("from_index");
    expect(args).to.have.own.property("to_index");
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
      {
        file_id: "d618f0e1-99f7-4d84-8fa0-9841a3432647",
        file_name: "firebase1",
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        size: 125223,
        type: "image/png",
        path: "images/Frame 427321239.png",
      },
      {
        file_id: "d618f0e1-99f7-4d84-8fa0-9841a3432647",
        file_name: "base",
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        size: 125223,
        type: "image/png",
        path: "images/Frame 427321239.png",
      },
    ];
  });

  getTotalCountOfFilesStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    if (args.organization_name === "fileNotFound")
      return {
        total_files: 0,
      };
    return {
      total_files: 3,
    };
  });

  searchFileNameWithOrganizationStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("file_name_prefix");
    expect(args).to.have.own.property("from_index");
    expect(args).to.have.own.property("to_index");
    if (args.to_index === 1) {
      return [
        {
          file_id: "d618f0e1-99f7-4d84-8fa0-9841a3432647",
          file_name: "firebase1",
          folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
          organization_name: "TestOrg",
          size: 125223,
          type: "image/png",
          path: "images/Frame 427321239.png",
        },
      ];
    }
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
      {
        file_id: "d618f0e1-99f7-4d84-8fa0-9841a3432647",
        file_name: "firebase1",
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        size: 125223,
        type: "image/png",
        path: "images/Frame 427321239.png",
      },
    ];
  });
});

After(() => {
  sandBox.resetHistory();
  this.organization_name = undefined;
  this.file_name_prefix = undefined;
  this.from_index = undefined;
  this.to_index = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "organization_name:{string}, file_name_prefix:{string}, from_index:{string}, to_index:{string} search-file-name",
  async (organization_name, file_name_prefix, from_index, to_index) => {
    this.organization_name = organization_name;
    this.file_name_prefix = file_name_prefix;
    this.from_index = from_index;
    this.to_index = to_index;
  }
);

When("tries to search file names and get files into range", async () => {
  const findFileName = makeFindFileName({
    filesDb,
    organizationsDb,
    createError,
    Joi,
  });

  try {
    this.result = await findFileName(
      this.organization_name,
      this.file_name_prefix,
      this.from_index,
      this.to_index
    );
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for get searched files",
  async (expectedResult) => {
    const expected = JSON.parse(expectedResult);
    expect(this.error).to.be.undefined;
    expect(this.result).to.deep.equal(expected);
  }
);

Then(
  "it should return the error: {string} for get searched files",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
