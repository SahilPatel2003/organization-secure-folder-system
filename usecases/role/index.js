const jwt = require("jsonwebtoken");
const Joi=require("joi");
const { join } = require("path");
require("dotenv").config(join(__dirname, "../../.env"));
const JWTKey = process.env.JWT_SECREATE_KEY;
const nodemailer = require("nodemailer");
const url = require("url");
const createError = require("../../utils/create-error");

const allDbs = require("../../database");
const {
  usersDb,
  rolesDb,
  organizationsDb,
} = allDbs;

const makeroleAssignment = require("./add-roles");
const makeGrantPermission = require("./grant-permission");
const makeTakePermissionFromAdmin = require("./take-permission-from-admin");
const makeroleChangeOfUser = require("./change-user-role");
const makeFindRoleDetails=require("./find-role-detail")
const makeFindAllRolesDetails=require("./find-all-role-details")

const addRole = makeroleAssignment({
  rolesDb,
  jwt
});
const grantPermissionByAdmin = makeGrantPermission({
  rolesDb,
  jwt,
  JWTKey,
  url,
  createError,
});
const takePermissionFromAdmin = makeTakePermissionFromAdmin({
  rolesDb,
  organizationsDb,
  usersDb,
  jwt,
  JWTKey,
  nodemailer,
  createError,
  Joi
});
const roleChangeOfUser = makeroleChangeOfUser({
  usersDb,
  rolesDb,
  createError,
  Joi
});

const findRoleDetails=makeFindRoleDetails({
  rolesDb,
  createError,
  Joi
})

const findAllRolesDetail=makeFindAllRolesDetails({
  rolesDb,
  organizationsDb,
  createError,
  Joi
})

module.exports = Object.freeze({
  addRole,
  grantPermissionByAdmin,
  takePermissionFromAdmin,
  roleChangeOfUser,
  findRoleDetails,
  findAllRolesDetail
});
