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

const makeFindFolderNameWithOrganization = require("./find-folder-name");

const foldersDb = {
  getTotalFoldersCount: () => {},
  searchFolderNameWithOrganization: () => {},
  getRangeFoldersFromOrganization: () => {},
};

const organizationsDb = {
  getAdminName: () => {},
};

let getAdminNameStub;
let getRangeFoldersFromOrganizationStub;
let searchFolderNameWithOrganizationStub;
let getTotalFoldersCountStub;

BeforeAll(() => {
  getTotalFoldersCountStub = sandBox.stub(foldersDb, "getTotalFoldersCount");
  searchFolderNameWithOrganizationStub = sandBox.stub(
    foldersDb,
    "searchFolderNameWithOrganization"
  );
  getRangeFoldersFromOrganizationStub = sandBox.stub(
    foldersDb,
    "getRangeFoldersFromOrganization"
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

  getRangeFoldersFromOrganizationStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("from_index");
    expect(args).to.have.own.property("to_index");
    return [
      {
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        folder_name: "a",
        parent_folder: "root",
        childrens: ["d0b7459d-baba-4e6c-a04a-eedb46ec3119"],
      },
      {
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        folder_name: "aaa",
        parent_folder: "root",
        childrens: ["p0b7459d-baba-4e6c-a04a-eedb46ec3119"],
      },
      {
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        folder_name: "b",
        parent_folder: "root",
        childrens: ["p0b7459d-baba-4e6c-a04a-eedb46ec3119"],
      },
    ];
  });

  getTotalFoldersCountStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    if (args.organization_name === "folderNotFound")
      return {
        total_folders: 0,
      };
    return {
      total_folders: 3,
    };
  });

  searchFolderNameWithOrganizationStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("folder_name_prefix");
    expect(args).to.have.own.property("from_index");
    expect(args).to.have.own.property("to_index");
    if (args.to_index === 1) {
      return [
        {
          folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
          organization_name: "TestOrg",
          folder_name: "aaa",
          parent_folder: "root",
          childrens: ["p0b7459d-baba-4e6c-a04a-eedb46ec3119"],
        },
      ];
    }
    return [
      {
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        folder_name: "a",
        parent_folder: "root",
        childrens: ["d0b7459d-baba-4e6c-a04a-eedb46ec3119"],
      },
      {
        folder_id: "76aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        folder_name: "aaa",
        parent_folder: "root",
        childrens: ["p0b7459d-baba-4e6c-a04a-eedb46ec3119"],
      },
    ];
  });
});

After(() => {
  sandBox.resetHistory();
  this.organization_name = undefined;
  this.folder_name_prefix = undefined;
  this.from_index = undefined;
  this.to_index = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "organization_name:{string}, folder_name_prefix:{string}, from_index:{string}, to_index:{string} search-folder-name",
  async (organization_name, folder_name_prefix, from_index, to_index) => {
    this.organization_name = organization_name;
    this.folder_name_prefix = folder_name_prefix;
    this.from_index = from_index;
    this.to_index = to_index;
  }
);

When("tries to search folder names and get folders into range", async () => {
  const findFolderNameWithOrganization = makeFindFolderNameWithOrganization({
    foldersDb,
    organizationsDb,
    createError,
    Joi,
  });

  try {
    this.result = await findFolderNameWithOrganization(
      this.organization_name,
      this.folder_name_prefix,
      this.from_index,
      this.to_index
    );
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for get searched folders",
  async (expectedResult) => {
    const expected = JSON.parse(expectedResult);
    expect(this.error).to.be.undefined;
    expect(this.result).to.deep.equal(expected);
  }
);

Then(
  "it should return the error: {string} for get searched folders",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
