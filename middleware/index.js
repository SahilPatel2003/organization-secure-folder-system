const response=require("../utils/response")

const makeVerifyUserAction=require("./verify-user")
const makeVerifySession=require("./verify-session")
const verifyUser=makeVerifyUserAction({response})
const verifySession=makeVerifySession({response})

module.exports=Object.freeze({
    verifyUser,
    verifySession
})