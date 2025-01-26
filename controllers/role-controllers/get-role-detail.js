const { findRoleDetails } = require("../../usecases/role");

module.exports = function makeGetRoleAction({ response }) {
  return async function getrole(req, res) {
    try {
      const { role_id } = req.params;

      const role_details = await findRoleDetails(role_id);
      return await response(
        res,
        "success",
        200,
        "application/json",
        role_details
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
