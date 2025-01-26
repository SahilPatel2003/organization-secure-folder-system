const { findFolderFiles } = require("../../usecases/file");

module.exports = function makeGetFilesFromFolderAction({ response }) {
  return async function getFilesFromFolder(req, res) {
    try {
      const organizationName = req.params.organization_name;
      const folder_name = req.params.folder_name;
      const folderFiles = await findFolderFiles(organizationName, folder_name);
      return await response(
        res,
        "success",
        200,
        "application/json",
        folderFiles
      );
    } catch (error) {
      console.error("Error: ", error.message);
      await response(
        res,
        "error",
        error.statusCode || 500,
        "application/json",
        error.message || "Internal Server Error"
      );
    }
  };
};
