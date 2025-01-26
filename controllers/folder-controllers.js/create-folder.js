const { addFolder } = require("../../usecases/folder");

module.exports = function makePostFolderAction({ response }) {
  return async function postFolder(req, res) {
    try {
      const { folder_name, parent_folder } = req.body.fields;
      const organization_name = req.params.organization_name;
      const token = req.headers.token;
      await addFolder(folder_name, parent_folder, organization_name, token);
      return await response(
        res,
        "success",
        200,
        "application/json",
        "Folder created successfully."
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
