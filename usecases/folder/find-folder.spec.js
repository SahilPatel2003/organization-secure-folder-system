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

const makeFindFolder = require("./find-folder");

const foldersDb = {
  getFolderDetailUsingId: () => {},
};

const organizationsDb = {
  getOrganizationDetail: () => {},
};

let getFolderDetailUsingIdStub;
let getOrganizationDetailStub;

BeforeAll(() => {
  getFolderDetailUsingIdStub = sandBox.stub(
    foldersDb,
    "getFolderDetailUsingId"
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

  getFolderDetailUsingIdStub.callsFake((args) => {
    expect(args).to.have.own.property("folder_id");
    if (args.folder_id === "88aa1dd2-9b08-479b-8a1f-ef1f972d5d52") return [];
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
});

After(() => {
  sandBox.resetHistory();
  this.organization_name = undefined;
  this.folder_id = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "organization_name:{string}, folder_id:{string} get-folder",
  async (organization_name, folder_id) => {
    this.organization_name = organization_name;
    this.folder_id = folder_id;
  }
);

When("tries to get folders details", async () => {
  const findFolder = makeFindFolder({
    foldersDb,
    organizationsDb,
    createError,
    Joi,
  });

  try {
    this.result = await findFolder(this.organization_name, this.folder_id);
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for getting folder details",
  async (expectedResult) => {
    const expected = JSON.parse(expectedResult);
    expect(this.error).to.be.undefined;
    expect(this.result).to.deep.equal(expected);
  }
);

Then(
  "it should return the error: {string} for getting folder details",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
