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
const JWTKey = "fake";
const nodemailer = {
  createTransport: sinon
    .stub()
    .returns({ sendMail: sinon.stub().returns(true) }),
};
const Joi = require("joi");

const makeFindAllFolders = require("./find-all-folders");

const foldersDb = {
  getFoldersfromOrganization: () => {},
};

const organizationsDb = {
  getOrganizationDetail: () => {},
};

let getFoldersfromOrganizationStub;
let getOrganizationDetailStub;

BeforeAll(() => {
  getFoldersfromOrganizationStub = sandBox.stub(
    foldersDb,
    "getFoldersfromOrganization"
  );
  getOrganizationDetailStub = sandBox.stub(
    organizationsDb,
    "getOrganizationDetail"
  );
});

Before(() => {
  getOrganizationDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    if (args.organization_name === "TestOrg1") return [];
    return [
      {
        organization_id: "f821e8ee-4a66-438a-be7c-c36890413e2d",
        organization_name: "TestOrg",
        created_by: "test@gmail.com",
        created_at: "2024-05-31T08:26:06.000Z",
      },
    ];
  });

  getFoldersfromOrganizationStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
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
      {
        folder_id: "89aa1dd2-9b08-479b-8a1f-ef1f972d5d52",
        organization_name: "TestOrg",
        folder_name: "b",
        parent_folder: "root",
        childrens: ["d0b7459d-baba-4e6c-a04a-eedb46ec3119"],
        created_at: "2024-06-02T05:06:45.000Z",
        created_by: "c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf",
        modified_at: "2024-06-02T05:06:58.000Z",
        modified_by: "test@gmail.com",
      },
    ];
  });
});

After(() => {
  sandBox.resetHistory();
  this.organization_name = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "organization_name:{string} get-all-folders",
  async (organization_name) => {
    this.organization_name = organization_name;
  }
);

When("tries to get all folders details", async () => {
  const findAllFolders = makeFindAllFolders({
    foldersDb,
    organizationsDb,
    createError,
    Joi,
  });

  try {
    this.result = await findAllFolders(this.organization_name);
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for getting all folders details",
  async (expectedResult) => {
    const expected = JSON.parse(expectedResult);
    expect(this.error).to.be.undefined;
    expect(this.result).to.deep.equal(expected);
  }
);

Then(
  "it should return the error: {string} for getting all folders details",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
