const {
  getAllUsersFromOrganization,
  getOrganizationDetails,
} = require("../controllers/organization-controllers.js");

function organizationData(router) {
  router._get(
    "/drive/:organization_name/organization_detail",
    getOrganizationDetails
  );
  router._get("/drive/:organization_name/users", getAllUsersFromOrganization);
}

module.exports = organizationData;
