const jwt = require("jsonwebtoken");
const {join}=require("path")
const JWTKey = process.env.JWT_SECREATE_KEY; 
const permissionMap = require("../../utils/permissions_array");
const allDbs=require('../../database')
const createError=require("../../utils/create-error")
const {usersDb,rolesDb,foldersDb}=allDbs;
const Joi=require('joi')

const makeCheckPermission=require("./check-permission")
const makeCheckSession=require("./check-session")

const checkPermission=makeCheckPermission({usersDb,foldersDb,rolesDb,jwt,JWTKey,createError,Joi})
const checkSession=makeCheckSession({createError})

module.exports=Object.freeze({checkPermission,checkSession})