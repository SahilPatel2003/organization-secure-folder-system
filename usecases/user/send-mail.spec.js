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
const makeSendMail = require("./send-mail");
const createError = require("../../utils/create-error");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const JWTKey = "fake";
const permissionMap = sinon.stub().returns("delete,move,read");
const nodemailer = {
  createTransport: sinon
    .stub()
    .returns({ sendMail: sinon.stub().returns(true) }),
};
const uuidv4 = sinon.stub();
const { token } = require("../../utils/token");

const usersDb = {
  getEmailsByOrganization: () => {},
  registerUser: () => {},
};

const rolesDb = {
  getRoleDetail: () => {},
};

let getEmailsByOrganizationStub;
let registerUserStub;
let getRoleDetailStub;

BeforeAll(() => {
  getEmailsByOrganizationStub = sandBox.stub(
    usersDb,
    "getEmailsByOrganization"
  );
  registerUserStub = sandBox.stub(usersDb, "registerUser");
  getRoleDetailStub = sandBox.stub(rolesDb, "getRoleDetail");
});

Before(() => {
  getEmailsByOrganizationStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    return [
      {
        email: "test1@gmail.com",
      },
    ];
  });

  registerUserStub.callsFake((args) => {
    expect(args).to.have.own.property("organization_name");
    expect(args).to.have.own.property("role_id");
    expect(args).to.have.own.property("email");
    expect(args).to.have.own.property("created_by");
  });

  getRoleDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("role_id");
    if (args.role_id == "16b2eb4c-f8eb-44b5-bc04-572592d16123") return;
    return [
      {
        role_id: "16b2eb4c-f8eb-44b5-bc04-572592d16e2c",
        organization_name: "TestOrg",
        name: "roles3",
        description: "you have this permissions",
        permissions: "1111",
        folders: "c",
      },
    ];
  });
});

After(() => {
  sandBox.resetHistory();
  this.to = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given("to:{string} send-mail", async (to) => {
  this.to = to;
});

When("the admin sends an invite mail to users", async () => {
  const sendMailByAdmin = makeSendMail({
    usersDb,
    rolesDb,
    uuidv4,
    jwt,
    JWTKey,
    nodemailer,
    permissionMap,
    Joi,
    createError,
  });

  try {
    await sendMailByAdmin(this.to, token);
    this.result = "Mail sent successfully.";
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for sending invite mail",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).be.equal(result);
  }
);

Then(
  "it should return the error: {string} for sending invite mail",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
