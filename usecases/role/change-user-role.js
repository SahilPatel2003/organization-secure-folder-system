module.exports = function makeroleChangeOfUser({
  usersDb,
  rolesDb,
  createError,
  Joi,
}) {
  return async function roleChangeOfUser(assigned_user_id, role_id) {
    const schema = Joi.object({
      user_id: Joi.string()
        .guid({ version: ["uuidv4", "uuidv5"] })
        .required(),
      role_id: Joi.string()
        .guid({ version: ["uuidv4", "uuidv5"] })
        .required(),
    });

    const { error, value } = schema.validate({
      user_id: assigned_user_id,
      role_id,
    });

    if (error) {
      throw createError(400, `Invalid data: ${error.details[0].message}`);
    }

    const userDetail = await usersDb.getUserDetail({
      user_id: assigned_user_id,
    });

    if (userDetail.length == 0) {
      throw createError(
        404,
        "Assigned user is not present in the organization."
      );
    }

    const roleDetail = await rolesDb.getRoleDetail({ role_id });

    if (roleDetail.length > 0) {
      await usersDb.updateRoleOfUserByAdmin({
        user_id: assigned_user_id,
        role_id,
      });
    } else {
      throw createError(404, "Role not found.");
    }
  };
};
