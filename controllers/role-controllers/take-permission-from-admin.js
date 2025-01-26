const { takePermissionFromAdmin } = require("../../usecases/role");

module.exports = function maketakePermissionAction({ response }) {
  return async function takePermission(req, res) {
    try {
      const { assigned_user_id, role_id, expiration_time } = req.body.fields;

      const token = req.headers.token;
      await takePermissionFromAdmin(
        assigned_user_id,
        role_id,
        expiration_time,
        token
      );
      await response(
        res,
        "success",
        200,
        "application/json",
        "Permission request sent successfully to the admin."
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
