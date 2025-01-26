const Joi=require("joi");
const createError=require("../utils/create-error")

const buildMakeUserEntity=require('./user');
const buildMakeRoleEntity=require('./role');
const buildMakeOrganizationEntity=require("./organization");
const buildMakeFolderEntity=require("./folder");
const buildMakeFileEntity=require("./file")
const buildMakePasswordAndUsernameEntity=require("./verify-password-username")

const makeUserEntity=buildMakeUserEntity({Joi,createError});
const makeRoleEntity=buildMakeRoleEntity({Joi,createError});
const makeFolderEntity=buildMakeFolderEntity({Joi,createError});
const makeFileEntity=buildMakeFileEntity({Joi,createError});
const makeOrganizationEntity=buildMakeOrganizationEntity({Joi,createError});
const makePasswordAndUsernameEntity=buildMakePasswordAndUsernameEntity({Joi,createError})


module.exports=Object.freeze({
   makeUserEntity,
   makeRoleEntity,
   makeFolderEntity,
   makeFileEntity,
   makeOrganizationEntity,
   makePasswordAndUsernameEntity
})

