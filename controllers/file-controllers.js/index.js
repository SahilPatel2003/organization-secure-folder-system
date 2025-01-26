const response = require("../../utils/response");

const makePostFileAction = require("./create-file");
const makeDeleteFileAction = require("./delete-file");
const makeMoveFileAction = require("./move-file");
const makeDeleteAllFileAction = require("./delete-all-files");
const makeDownloadFileAction = require("./download-file");
const makeGetFileAction = require("./get-file");
const makeGetFileFromFolderAction = require("./get-folder-files");
const makeSearchFileAction = require("./search-file-name");

const postFile = makePostFileAction({ response });
const deleteFile = makeDeleteFileAction({ response });
const moveFile = makeMoveFileAction({ response });
const deleteAllFile = makeDeleteAllFileAction({ response });
const downloadFile = makeDownloadFileAction({ response });
const getFile = makeGetFileAction({ response });
const getFilesFromFolder = makeGetFileFromFolderAction({ response });

const searchFileName = makeSearchFileAction({
  response,
});

module.exports = Object.freeze({
  postFile,
  deleteFile,
  moveFile,
  deleteAllFile,
  downloadFile,
  getFile,
  getFilesFromFolder,
  searchFileName,
});
