const { moveFolderByUser } = require("../../usecases/folder");

module.exports = function makeMoveFolderAction({ response }) {
  return async function moveFolder(req, res) {
    try {
      const { source_folder_name, destination_folder_name } = req.body.fields;

      const organization_name = req.params.organization_name;

      const token = req.headers.token;
      await moveFolderByUser(
        source_folder_name,
        destination_folder_name,
        organization_name,
        token
      );
      return await response(
        res,
        "success",
        200,
        "application/json",
        "The folder was moved successfully."
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
