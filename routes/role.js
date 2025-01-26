const {
  postRole,
  changeRoleOfUser,
  grantPermission,
  takePermission,
  getRoleDetail,
  getAllRolesDetail,
} = require("../controllers/role-controllers");
const { verifySession, verifyUser } = require("../middleware");

function roleData(router) {
  router._post("/drive/role_assignment", postRole, [verifyUser, verifySession]);
  router._post("/drive/take_permission_from_admin", takePermission, [
    verifyUser,
    verifySession,
  ]);
  router._put("/drive/change_role", changeRoleOfUser, [
    verifyUser,
    verifySession,
  ]);
  router._get("/drive/grant_permission", grantPermission, [verifySession]);
  router._get("/drive/:organization_name/role_id/:role_id", getRoleDetail, [
    verifySession,
  ]);
  router._get("/drive/:organization_name/roles", getAllRolesDetail, [
    verifySession,
  ]);
}

module.exports = roleData;
