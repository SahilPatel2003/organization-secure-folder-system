const response=require("../../utils/response")

const makepostRoleAction=require("./add-role-by-admin");
const makeChangeRoleOfUserAction=require("./change-role-of-user")
const makeGrantPermissionAction=require("./grant-permission")
const maketakePermissionAction=require("./take-permission-from-admin")
const makeGetRoleAction=require("./get-role-detail")
const makeGetAllRolesDetailAction=require("./get-all-roles-details")

const postRole=makepostRoleAction({response});
const changeRoleOfUser=makeChangeRoleOfUserAction({response});
const grantPermission=makeGrantPermissionAction({response});
const takePermission=maketakePermissionAction({response});
const getRoleDetail=makeGetRoleAction({response});
const getAllRolesDetail=makeGetAllRolesDetailAction({response})


module.exports=Object.freeze({
    postRole,
    changeRoleOfUser,
    grantPermission,
    takePermission,
    getRoleDetail,
    getAllRolesDetail
})