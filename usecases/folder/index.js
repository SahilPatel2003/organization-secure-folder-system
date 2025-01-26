const Joi=require("joi");
const jwt = require("jsonwebtoken");
const { join } = require("path");
require("dotenv").config(join(__dirname, "../.env"));
const allDbs = require("../../database");
const createError = require("../../utils/create-error");
const {
  organizationsDb,
  rolesDb,
  foldersDb,
  usersDb
} = allDbs;

const makeAddFolder = require("./create-folder");
const makeRemoveFolder = require("./delete-folder");
const makeMoveFolder = require("./move-folder");
const makeFindAllFolders = require("./find-all-folders");
const makeFindFolder = require("./find-folder");
const makeFindFolderName = require("./find-folder-name");

const addFolder = makeAddFolder({
  foldersDb,
  jwt,
  createError,
});
const removeFolder = makeRemoveFolder({
  foldersDb,
  jwt,
  createError,
  Joi
});
const moveFolderByUser = makeMoveFolder({
  foldersDb,
  rolesDb,
  usersDb,
  jwt,
  createError,
  Joi
});
const findAllFolders = makeFindAllFolders({
  foldersDb,
  organizationsDb,
  createError,
  Joi
});
const findFolder = makeFindFolder({
  foldersDb,
  organizationsDb,
  createError,
  Joi
});
const findFolderName = makeFindFolderName({
  foldersDb,
  organizationsDb,
  createError,
  Joi
});

module.exports = Object.freeze({
  addFolder,
  removeFolder,
  moveFolderByUser,
  findAllFolders,
  findFolder,
  findFolderName
});
