const { findFile } = require("../../usecases/file");

module.exports = function makeGetFileAction({ response }) {
  return async function getFile(req, res) {
    try {
      const organizationName = req.params.organization_name;
      const folder_name = req.params.folder_name;
      const file_name = req.params.file_name;
      const files_detail = await findFile(
        organizationName,
        folder_name,
        file_name
      );
      return await response(
        res,
        "success",
        200,
        "application/json",
        files_detail
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
