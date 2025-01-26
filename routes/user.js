const {
  postAdmin,
  postUser,
  loginUser,
  blockUser,
  changePassword,
  resetPassword,
  sendMail,
} = require("../controllers/user-controllers");

const { verifySession, verifyUser } = require("../middleware");

function userData(router) {
  router._post("/drive/register", postAdmin);
  router._post("/drive/send-email", sendMail, [verifyUser, verifySession]);
  router._post("/drive/login", loginUser);
  router._post("/drive/register_user", postUser);
  router._post("/drive/reset-password", resetPassword);
  router._post("/drive/change-password", changePassword);
  router._patch("/drive/block-user", blockUser, [verifyUser, verifySession]);
}

module.exports = userData;
