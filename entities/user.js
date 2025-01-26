module.exports = function buildMakeUserEntity({ Joi, createError }) {
  return async function makeUserEntity(userData) {
    const userSchema = Joi.object({
      organization_name: Joi.string().max(255).required(),
      role_id: Joi.string()
        .guid({ version: ["uuidv4", "uuidv5"] })
        .allow(null),
      username: Joi.string().max(255).allow(null),
      email: Joi.string().email().max(255).required(),
      password: Joi.string().allow(null),
      is_admin: Joi.boolean().default(false),
      user_status: Joi.boolean().default(false),
      created_at: Joi.date().default(() => new Date()),
      created_by: Joi.string()
        .guid({ version: ["uuidv4", "uuidv5"] })
        .allow(null),
      invitation_accepted_at: Joi.date().allow(null),
      modified_at: Joi.date().allow(null).default(null),
      is_password_changed: Joi.boolean().default(false),
      remember_me: Joi.boolean().default(false),
    });

    const { error, value } = userSchema.validate(userData);

    if (error) {
      throw createError(400, `Invalid user data,${error.details[0].message}`);
    } else {
      return Object.freeze({
        getOrganizationName: () => value.organization_name,
        getRoleId: () => value.role_id,
        getUsername: () => value.username,
        getEmail: () => value.email,
        getPassword: () => value.password,
        isAdmin: () => value.is_admin,
        getUserStatus: () => value.user_status,
        getCreatedAt: () => value.created_at,
        getCreatedBy: () => value.created_by,
        getInvitationAcceptedAt: () => value.invitation_accepted_at,
        getModifiedAt: () => value.modified_at,
        isPasswordChanged: () => value.is_password_changed,
        rememberMe: () => value.remember_me,
      });
    }
  };
};
