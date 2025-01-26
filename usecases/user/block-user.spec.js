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
const makeBlockUser = require("./block-user");
const createError = require("../../utils/create-error");
const Joi = require("joi");

const usersDb = {
  blockUser: () => {},
};

let blockUserStub;

BeforeAll(() => {
  blockUserStub = sandBox.stub(usersDb, "blockUser");
});

Before(() => {
  blockUserStub.callsFake((args) => {
    expect(args).to.have.own.property("blocked_user_id");
  });
});

After(() => {
  sandBox.resetHistory();
  this.blocked_user_id = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given("blocked_user_id: {string} block-user", async (blocked_user_id) => {
  this.blocked_user_id = blocked_user_id;
});

Given("the minimalism", function () {
  return "success";
});

When("the admin tries to block a user", async () => {
  const blockUserByAdmin = makeBlockUser({
    usersDb,
    createError,
    Joi,
  });

  try {
    await blockUserByAdmin(this.blocked_user_id);
    this.result = "User successfully blocked.";
  } catch (err) {
    this.error = err.message;
  }
});

Then(
  "it should return the result: {string} for blocking user",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).be.equal("User successfully blocked.");
  }
);

Then(
  "it should return the error: {string} for blocking user",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
