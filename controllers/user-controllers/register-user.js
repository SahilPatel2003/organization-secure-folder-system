const { addUser } = require("../../usecases/user");

module.exports = function makePostUserAction({ response }) {
  return async function postUser(req, res) {
    try {
      const { username, password } = req.body.fields;
      await addUser(username, password);
      await response(
        res,
        "success",
        200,
        "application/json",
        "User created successfully."
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
