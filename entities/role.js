module.exports = function buildMakeRoleEntity({ Joi, createError }) {
  return async function makeRoleEntity(roleData) {
    const roleSchema = Joi.object({
      organization_name: Joi.string().max(255).required(),
      name: Joi.string().max(255).required(),
      description: Joi.string().max(65535).required(),
      permissions: Joi.string().max(10).required(),
      folders: Joi.string().required(),
      created_at: Joi.date().default(() => new Date()),
      created_by: Joi.string().guid({ version: ["uuidv4", "uuidv5"] }),
      modified_at: Joi.date().allow(null).default(null),
    });

    const { error, value } = roleSchema.validate(roleData);

    if (error) {
      throw createError(400, `Invalid role data,${error.details[0].message}`);
    } else {
      return Object.freeze({
        getOrganizationName: () => value.organization_name,
        getName: () => value.name,
        getDescription: () => value.description,
        getPermissions: () => value.permissions,
        getFolders: () => value.folders,
        getCreatedAt: () => value.created_at,
        getCreatedBy: () => value.created_by,
        getModifiedAt: () => value.modified_at,
      });
    }
  };
};
