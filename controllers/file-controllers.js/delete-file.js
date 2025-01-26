const { removeFile } = require("../../usecases/file");

module.exports = function makeDeleteFileAction({ response }) {
  return async function deleteFile(req, res) {
    try {
      const { file_name } = req.body.fields;

      const folder_name = req.params.folder_name;

      const organization_name = req.params.organization_name;

      const token = req.headers.token;
      await removeFile(file_name, folder_name, organization_name);
      return await response(
        res,
        "success",
        200,
        "application/json",
        "The file was deleted successfully."
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
