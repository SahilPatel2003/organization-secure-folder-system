const { addRole } = require("../../usecases/role");

module.exports = function makepostRoleAction({ response }) {
  return async function postRole(req, res) {
    try {
      const { name, description, permissions, folders } = req.body.fields;
      const token = req.headers.token;
      await addRole(name, description, permissions, folders, token);
      await response(
        res,
        "success",
        200,
        "application/json",
        "Role added successfully."
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
