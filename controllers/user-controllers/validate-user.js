const { loginUser } = require("../../usecases/user");

module.exports = function makeValidateUserAction({ response }) {
  return async function validateUser(req, res) {
    try {
      const { organization_name, email, password, rememberMe } =
        req.body.fields;
      await loginUser(organization_name, email, password, rememberMe);
      await response(res, "success", 200, "application/json", "Login successfully.");
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
