const { addAdmin } = require("../../usecases/user");

module.exports = function makePostAdminAction({ response }) {
  return async function postAdmin(req, res) {
    try {
      const { organization_name, username, email, password } = req.body.fields;
      await addAdmin(organization_name, username, email, password);
      await response(
        res,
        "success",
        200,
        "application/json",
        "Organization created successfully. You have successfully registered."
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
