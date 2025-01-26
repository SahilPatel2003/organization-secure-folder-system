module.exports = function buildMakeOrganizationEntity({ Joi, createError }) {
  return async function makeOrganizationEntity(organizationData) {
    const organizationSchema = Joi.object({
      organization_name: Joi.string().max(255).required(),
      created_by: Joi.string().max(255).required(),
      created_at: Joi.date().default(() => new Date()),
    });

    const { error, value } = organizationSchema.validate(organizationData);

    if (error) {
      throw createError(
        400,
        `Invalid organization data,${error.details[0].message}`
      );
    } else {
      return Object.freeze({
        getOrganizationName: () => value.organization_name,
        getCreatedBy: () => value.created_by,
        getCreatedAt: () => value.created_at,
      });
    }
  };
};
