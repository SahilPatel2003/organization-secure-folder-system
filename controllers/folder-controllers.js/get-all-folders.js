const { findAllFolders } = require("../../usecases/folder");

module.exports = function makeGetAllFoldersAction({ response }) {
  return async function getAllFolders(req, res) {
    try {
      const organizationName = req.params.organization_name;
      const allFolders = await findAllFolders(organizationName);
      return await response(
        res,
        "success",
        200,
        "application/json",
        allFolders
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
