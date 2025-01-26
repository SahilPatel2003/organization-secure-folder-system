const { checkSession } = require("../usecases/middleware");

module.exports = function makeSessionVerifyAction({ response }) {
  return async function sessionVerify(req, res) {
    try {
      const cookieHeader = req.headers.cookie;

      await checkSession(cookieHeader);
    } catch (error) {
      console.error("Error: ", error.message);
      await response(
        res,
        "error",
        error.statusCode || 500,
        "application/json",
        error.message || "Internal Server Error"
      );
      return true;
    }
  };
};
