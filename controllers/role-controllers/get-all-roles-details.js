const { findAllRolesDetail } = require("../../usecases/role");

module.exports = function makeGetAllRolesDetailAction({ response }) {
  return async function getAllRolesDetail(req, res) {
    try {
      const { organization_name } = req.params;

      const roles_details = await findAllRolesDetail(organization_name);
      return await response(
        res,
        "success",
        200,
        "application/json",
        roles_details
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
