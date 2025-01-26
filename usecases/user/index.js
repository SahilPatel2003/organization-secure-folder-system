const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { join } = require("path");
require("dotenv").config(join(__dirname, "../.env"));
const JWTKey = process.env.JWT_SECREATE_KEY;
const nodemailer = require("nodemailer");
const url = require("url");
const permissionMap = require("../../utils/permissions_array");
const allDbs = require("../../database");
const createError = require("../../utils/create-error");
const Joi = require("joi");
const {
  usersDb,
  organizationsDb,
  rolesDb,
} = allDbs;

const makeRegisterAdmin = require("./create-admin");
const makeSendMail = require("./send-mail");
const makeRegisterUser = require("./create-user");
const makeLoginUser = require("./login");
const makeBlockUser = require("./block-user");
const makeResetPassword = require("./reset-password");
const makeChangePassword = require("./change-password");

const addAdmin = makeRegisterAdmin({
  usersDb,
  organizationsDb,
  jwt,
  JWTKey,
  crypto,
  createError,
});
const sendMailByAdmin = makeSendMail({
  usersDb,
  rolesDb,
  uuidv4,
  jwt,
  JWTKey,
  crypto,
  nodemailer,
  permissionMap,
  Joi,
  createError,
});
const addUser = makeRegisterUser({
  usersDb,
  crypto,
  url,
  createError,
});
const loginUser = makeLoginUser({
  usersDb,
  organizationsDb,
  jwt,
  JWTKey,
  crypto,
  createError,
  Joi
});
const blockUserByAdmin = makeBlockUser({
  usersDb,
  createError,
  Joi
});
const resetPasswordByUser = makeResetPassword({usersDb, jwt, JWTKey,nodemailer, Joi,createError });
const passwordChangeByUser = makeChangePassword({
  usersDb,
  jwt,
  JWTKey,
  url,
  crypto,
  Joi,
  createError,
});


module.exports = Object.freeze({
  addAdmin,
  addUser,
  sendMailByAdmin,
  loginUser,
  blockUserByAdmin,
  resetPasswordByUser,
  passwordChangeByUser,
});
