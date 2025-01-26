const { blockUserByAdmin } = require("../../usecases/user");

module.exports = function makeBlockUserAction({ response }) {
  return async function blockUser(req, res) {
    try {
      const { user_id } = req.body.fields;
      await blockUserByAdmin(user_id);
      await response(
        res,
        "success",
        200,
        "application/json",
        "You successfully blocked user."
      );
    } catch (error) {
      console.error("Error blocking user:", error.message);
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
