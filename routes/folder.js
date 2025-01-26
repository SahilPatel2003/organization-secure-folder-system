const {
  postFolder,
  deleteFolder,
  moveFolder,
  getAllFolders,
  getFolder,
  searchFolderName,
} = require("../controllers/folder-controllers.js");

const { verifySession, verifyUser } = require("../middleware");

function folderData(router) {
  router._post("/drive/:organization_name/createfolder", postFolder, [
    verifyUser,
    verifySession,
  ]);
  router._delete("/drive/:organization_name/deletefolder", deleteFolder, [
    verifyUser,
    verifySession,
  ]);
  router._patch("/drive/:organization_name/movefolder", moveFolder, [
    verifyUser,
    verifySession,
  ]);
  router._get("/drive/:organization_name/folders", getAllFolders, [
    verifySession,
  ]);
  router._get(
    "/drive/:organization_name/folders/folder_detail/:folder_id",
    getFolder,
    [verifySession]
  );
  router._get(
    "/drive/:organization_name/folders/folder_name_search",
    searchFolderName
  );
}

module.exports = folderData;
