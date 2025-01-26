const { resetPasswordByUser } = require("../../usecases/user");

module.exports = function makeResetPasswordAction({ response }) {
  return async function resetPassword(req, res) {
    try {
      const { organization_name, email } = req.body.fields;
      await resetPasswordByUser(organization_name, email);
      await response(
        res,
        "success",
        200,
        "application/json",
        "Password reset email sent successfully!"
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
