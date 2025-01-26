const { grantPermissionByAdmin } = require("../../usecases/role");

module.exports = function makeGrantPermissionAction({ response }) {
  return async function grantPermission(req, res) {
    try {
      await grantPermissionByAdmin(req.url);
      await response(
        res,
        "success",
        200,
        "application/json",
        `Role assigned successfully.`
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
