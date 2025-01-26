module.exports = function makeFindRoleDetails({ rolesDb, createError, Joi }) {
  return async function findRoleDetails(role_id) {
    const roleIDSchema = Joi.object({
      role_id: Joi.string()
        .guid({ version: ["uuidv4", "uuidv5"] })
        .required(),
    });

    const { error, value } = roleIDSchema.validate({ role_id });

    if (error) {
      throw createError(400, `Invalid data,${error.details[0].message}`);
    }

    const role_detail = await rolesDb.getRoleDetail({ role_id });

    if (role_detail.length === 0) {
      throw createError(404, "Role not found");
    }

    return role_detail[0];
  };
};
