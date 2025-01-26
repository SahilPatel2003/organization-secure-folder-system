const response=require("../../utils/response")

const makePostAdminAction=require("./register-admin");
const makePostUserAction=require("./register-user")
const makeBlockUserAction=require("./block-user")
const makeChangePasswordAction=require("./change-password")
const makeResetPasswordAction=require("./reset-password")
const makesendMailAction=require("./send-mail")
const makeValidateUserAction=require("./validate-user")

const postAdmin=makePostAdminAction({response});
const postUser=makePostUserAction({response});
const loginUser=makeValidateUserAction({response})
const blockUser=makeBlockUserAction({response});
const changePassword=makeChangePasswordAction({response});
const resetPassword=makeResetPasswordAction({response});
const sendMail=makesendMailAction({response})

module.exports=Object.freeze({
    postAdmin,
    postUser,
    loginUser,
    blockUser,
    changePassword,
    resetPassword,
    sendMail
})