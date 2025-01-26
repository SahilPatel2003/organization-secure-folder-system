module.exports = function makeFindOrganizationDetails({
  organizationsDb,
  createError,
  Joi,
}) {
  return async function findOrganizationDetails(organization_name) {
    const organizationNameSchema = Joi.object({
      organization_name: Joi.string().max(255).required(),
    });

    const { error, value } = organizationNameSchema.validate({
      organization_name,
    });

    if (error) {
      throw createError(400, `Invalid data,${error.details[0].message}`);
    }
    const organization = await organizationsDb.getOrganizationDetail({
      organization_name,
    });

    if (organization.length === 0) {
      throw createError(404, "Organization not found");
    }

    return organization[0];
  };
};
