module.exports = function buildMakePasswordAndUsernameEntity({
  Joi,
  createError,
}) {
  return async function makePasswordAndUsernameEntity(passwordAndUsernameData) {
    const passwordAndUsernameDataSchema = Joi.object({
      username: Joi.string().max(255).required(),
      password: Joi.string().required(),
    });

    const { error, value } = passwordAndUsernameDataSchema.validate(
      passwordAndUsernameData
    );

    if (error) {
      throw createError(400, `Invalid user data,${error.details[0].message}`);
    } else {
      return Object.freeze({
        getUsername: () => value.username,
        getPassword: () => value.password,
      });
    }
  };
};
