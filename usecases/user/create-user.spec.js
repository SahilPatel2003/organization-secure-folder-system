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
const makeAddUser = require("./create-user");
const createError = require("../../utils/create-error");
const url = sinon.stub();

const usersDb = {
  updateUser: () => {},
  getUserDetail: () => {},
};

let updateUserStub;
let getUserDetailStub;

BeforeAll(() => {
  updateUserStub = sandBox.stub(usersDb, "updateUser");
  getUserDetailStub = sandBox.stub(usersDb, "getUserDetail");
});

Before(() => {
  updateUserStub.callsFake((args) => {
    expect(args).to.have.own.property("username");
    expect(args).to.have.own.property("hash");
    expect(args).to.have.own.property("salt");
    expect(args).to.have.own.property("user_id");
  });

  getUserDetailStub.callsFake((args) => {
    expect(args).to.have.own.property("user_id");
    if (this.password == "password2") return [{ hash: true }];
    return [{ hash: false }];
  });
});

After(() => {
  sandBox.resetHistory();
  this.username = undefined;
  this.password = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "username:{string}, password:{string} create-user",
  async (username, password) => {
    this.username = username;
    this.password = password;
  }
);

When("try to add user", async () => {
  const addUser = makeAddUser({
    usersDb,
    crypto: {
      randomBytes: sinon.stub().returns(true),
      pbkdf2Sync: sinon.stub().returns(true),
    },
    url,
    createError,
  });

  try {
    await addUser(this.username, this.password);
    this.result = "You have successfully registered.";
  } catch (err) {
    this.error = err.message;
  }
});

Then("it should return the result: {string} for add user", async (result) => {
  expect(this.error).to.be.undefined;
  expect(this.result).be.equal(result);
});

Then("it should return the error: {string} for add user", async (error) => {
  expect(this.error).to.be.equal(error);
});
