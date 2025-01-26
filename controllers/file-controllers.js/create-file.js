const { addFile } = require("../../usecases/file");

module.exports = function makePostFileAction({ response }) {
  return async function postFile(req, res) {
    try {
      const { file_name, path } = req.body.fields;
      const parent_folder = req.params.folder_name;
      const organization_name = req.params.organization_name;
      const token = req.headers.token;
      await addFile(file_name, path, parent_folder, organization_name, token);
      return await response(
        res,
        "success",
        200,
        "application/json",
        "file created successfully."
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
