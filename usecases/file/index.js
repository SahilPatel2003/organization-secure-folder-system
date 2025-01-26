const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { join } = require("path");
const allDbs = require("../../database");
const createError = require("../../utils/create-error");
const { filesDb, foldersDb, organizationsDb } = allDbs;
require("dotenv").config(join(__dirname, "../../.env"));

const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");

admin.initializeApp({
  credential: admin.credential.cert(join(__dirname, "../../config/sahil.json")),
  storageBucket: process.env.STORAGEBUCKET,
});

const bucket = admin.storage().bucket();

const makeAddFile = require("./create-file");
const makeRemoveFile = require("./delete-file");
const makeMoveFile = require("./move-file");
const makeRemoveAllFiles = require("./delete-all-file");
const makeDownloadFile = require("./download-file");
const makeFindFile = require("./find-file");
const makeFindFileName = require("./find-file-name");
const makeFindFolderFiles = require("./find-folder-files");

const addFile = makeAddFile({
  filesDb,
  foldersDb,
  jwt,
  bucket,
  createError,
});
const removeFile = makeRemoveFile({
  filesDb,
  foldersDb,
  jwt,
  createError,
  Joi,
});
const moveFileByUser = makeMoveFile({
  filesDb,
  foldersDb,
  jwt,
  createError,
  Joi,
});
const removeAllFile = makeRemoveAllFiles({
  filesDb,
  foldersDb,
  jwt,
  createError,
  Joi,
});
const downloadFileByUser = makeDownloadFile({
  filesDb,
  foldersDb,
  bucket,
  createError,
  Joi,
});

const findFile = makeFindFile({
  filesDb,
  foldersDb,
  organizationsDb,
  createError,
  Joi
});
const findFileName = makeFindFileName({
  filesDb,
  organizationsDb,
  createError,
  Joi
});
const findFolderFiles = makeFindFolderFiles({
  filesDb,
  foldersDb,
  organizationsDb,
  createError,
  Joi
});


module.exports = Object.freeze({
  addFile,
  removeFile,
  moveFileByUser,
  removeAllFile,
  downloadFileByUser,
  findFile,
  findFileName,
  findFolderFiles,
});
