const { passwordChangeByUser } = require("../../usecases/user");

module.exports = function makeChangePasswordAction({ response }) {
  return async function changePassword(req, res) {
    try {
      const { password } = req.body.fields;
      await passwordChangeByUser(password,req.url);
      return await response(
        res,
        "success",
        200,
        "application/json",
        "Password updated successfully"
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
