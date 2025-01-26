const { findFolder } = require("../../usecases/folder");

module.exports = function makeGetFolderAction({ response }) {
  return async function getFolder(req, res) {
    try {
      const organizationName = req.params.organization_name;
      const folder_id = req.params.folder_id;
      const folder_detail = await findFolder(organizationName, folder_id);
      await response(res, "success", 200, "application/json", folder_detail);
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
