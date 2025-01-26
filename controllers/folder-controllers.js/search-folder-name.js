const { findFolderName } = require("../../usecases/folder");

module.exports = function makeSearchFolderName({ response }) {
  return async function searchFolderName(req, res) {
    try {


      const { folder_name_prefix, from_index, to_index } = req.query;
      const { organization_name } = req.params;
      const searchedFolders = await findFolderName(
        organization_name,
        folder_name_prefix,
        from_index,
        to_index
      );
      
      await response(res, "success", 200, "application/json", searchedFolders);
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
