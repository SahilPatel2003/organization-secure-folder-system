module.exports = function makeBlockUser({ usersDb, createError, Joi }) {
  return async function blockUserByAdmin(blocked_user_id) {
    const schema = Joi.object({
      blocked_user_id: Joi.string()
        .guid({ version: ["uuidv4", "uuidv5"] })
        .required(),
    });

    const { error, value } = schema.validate({ blocked_user_id });

    if (error) {
      throw createError(400, `Invalid data: ${error.details[0].message}`);
    }

    await usersDb.blockUser({ blocked_user_id });
  };
};
