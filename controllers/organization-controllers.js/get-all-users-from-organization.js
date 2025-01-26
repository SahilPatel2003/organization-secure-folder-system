const { findAllUsersFromOrganization } = require("../../usecases/organization");

module.exports = function makeGetAllUsersFromOrganizationAction({ response }) {
  return async function getAllUsersFromOrganization(req, res) {
    try {
      const organizationName = req.params.organization_name;
      const allUsersFromOrganization = await findAllUsersFromOrganization(
        organizationName
      );
      await response(
        res,
        "success",
        200,
        "application/json",
        allUsersFromOrganization
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
