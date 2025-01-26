const {
  postFile,
  deleteFile,
  moveFile,
  deleteAllFile,
  downloadFile,
  getFile,
  getFilesFromFolder,
  searchFileName,
} = require("../controllers/file-controllers.js");
const { verifySession, verifyUser } = require("../middleware");

function fileData(router) {
  router._post(
    "/drive/:organization_name/folder_name/:folder_name/createFile",
    postFile,
    [verifyUser, verifySession]
  );
  router._delete(
    "/drive/:organization_name/folder_name/:folder_name/deleteFile",
    deleteFile,
    [verifyUser, verifySession]
  );
  router._delete(
    "/drive/:organization_name/folder_name/:folder_name/deleteAllFiles",
    deleteAllFile,
    [verifySession]
  );
  router._patch(
    "/drive/:organization_name/folder_name/:folder_name/moveFile",
    moveFile,
    [verifyUser, verifySession]
  );
  router._get(
    "/drive/:organization_name/folder_name/:folder_name/all_folder_files",
    getFilesFromFolder,
    [verifySession]
  );
  router._get(
    "/drive/:organization_name/folder_name/:folder_name/files/:file_name",
    getFile,
    [verifySession]
  );

  router._get("/drive/:organization_name/files", searchFileName);
  router._get(
    "/drive/:organization_name/folder_name/:folder_name/filename/:file_name/download",
    downloadFile,
    [verifySession]
  );
}

module.exports = fileData;
