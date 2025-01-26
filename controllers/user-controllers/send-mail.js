const { sendMailByAdmin } = require("../../usecases/user");

module.exports = function makeSendMailAction({ response }) {
  return async function sendMail(req, res) {
    try {
      const { to } = req.body.fields;
      const token = req.headers.token;
      await sendMailByAdmin(to, token);
      await response(
        res,
        "success",
        200,
        "application/json",
        "Mail sent successfully."
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
