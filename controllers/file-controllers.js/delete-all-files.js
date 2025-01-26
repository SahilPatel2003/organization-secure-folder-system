const { removeAllFile } = require("../../usecases/file");

module.exports = function makeDeleteAllFileAction({ response }) {
  return async function deleteAllFile(req, res) {
    try {
      const folder_name = req.params.folder_name;

      const organization_name = req.params.organization_name;

      const token = req.headers.token;
      await removeAllFile(folder_name, organization_name, token);
      return await response(
        res,
        "success",
        200,
        "application/json",
        "The all files were deleted successfully."
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
