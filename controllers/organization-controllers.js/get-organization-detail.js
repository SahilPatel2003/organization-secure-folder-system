const { findOrganizationDetails } = require("../../usecases/organization");

module.exports = function makeGetOrganizationDetailsAction({ response }) {
  return async function getOrganizationDetails(req, res) {
    try {
      const organizationName = req.params.organization_name;
      const organizationDetail = await findOrganizationDetails(
        organizationName
      );
      await response(
        res,
        "success",
        200,
        "application/json",
        organizationDetail
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
