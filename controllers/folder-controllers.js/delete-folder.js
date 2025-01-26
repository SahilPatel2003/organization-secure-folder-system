const { removeFolder } = require("../../usecases/folder");

module.exports = function makeDeleteFolderAction({ response }) {
  return async function deleteFolder(req, res) {
    try {
      const { folder_name } = req.body.fields;

      const organization_name = req.params.organization_name;

      const token = req.headers.token;
      await removeFolder(folder_name, organization_name, token);
      return await response(
        res,
        "success",
        200,
        "application/json",
        "The folder was deleted successfully."
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
