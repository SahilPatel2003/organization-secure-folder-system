const { checkPermission } = require("../usecases/middleware");

module.exports = function makeVerifyUserAction({ response }) {
  return async function verifyUser(req, res) {
    try {
      const token = req.headers.token;
      const data = req.body.fields;
      const path = req.pathName;
      await checkPermission(path, token, data);
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
