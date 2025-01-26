const { roleChangeOfUser } = require("../../usecases/role");

module.exports = function makeChangeRoleOfUserAction({ response }) {
  return async function changeRoleOfUser(req, res) {
    try {
      const { user_id, role_id } = req.body.fields;
      const token = req.headers.token;
      await roleChangeOfUser(user_id, role_id, token);
      await response(
        res,
        "success",
        200,
        "application/json",
        "User role updated successfully."
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
