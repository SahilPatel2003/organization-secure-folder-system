const { findFileName } = require("../../usecases/file");

module.exports = function makeSearchFile({ response }) {
  return async function searchFileName(req, res) {
    try {
      const { file_name_prefix, from_index, to_index } = req.query;
      const { organization_name } = req.params;
      const searchedFiles = await findFileName(
        organization_name,
        file_name_prefix,
        from_index,
        to_index
      );
      return await response(
        res,
        "success",
        200,
        "application/json",
        searchedFiles
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
