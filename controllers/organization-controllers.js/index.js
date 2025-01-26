const response = require("../../utils/response");

const makeGetAllUsersFromOrganizationAction = require("./get-all-users-from-organization");
const makeGetOrganizationDetailsAction = require("./get-organization-detail");

const getAllUsersFromOrganization = makeGetAllUsersFromOrganizationAction({
  response,
});
const getOrganizationDetails = makeGetOrganizationDetailsAction({ response });

module.exports = Object.freeze({
  getAllUsersFromOrganization,
  getOrganizationDetails,
});
