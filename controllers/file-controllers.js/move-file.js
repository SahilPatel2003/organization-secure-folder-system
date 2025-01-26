const { moveFileByUser } = require("../../usecases/file");

module.exports = function makeMoveFileAction({ response }) {
  return async function moveFile(req, res) {
    try {
      const { file_name, destination_folder } = req.body.fields;

      const organization_name = req.params.organization_name;

      const source_folder_name = req.params.folder_name;

      const token = req.headers.token;
      await moveFileByUser(
        file_name,
        destination_folder,
        organization_name,
        source_folder_name,
        token
      );
      return await response(
        res,
        "success",
        200,
        "application/json",
        "The file was moved successfully."
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
