module.exports = function makeFindAllRolesDetails({
  rolesDb,
  organizationsDb,
  createError,
  Joi,
}) {
  return async function findAllRolesDetails(organization_name) {
    const organizationNameSchema = Joi.object({
      organization_name: Joi.string().max(255).required(),
    });

    const { error, value } = organizationNameSchema.validate({
      organization_name,
    });

    if (error) {
      throw createError(400, `Invalid data,${error.details[0].message}`);
    }

    const result = organizationsDb.getAdminName({ organization_name });

    if (result.length === 0) throw createError(404, "organization not found");

    const roles_details = await rolesDb.getAllRolesDetail({
      organization_name,
    });

    if (roles_details.length === 0) {
      throw createError(404, "Roles not found");
    }

    return roles_details;
  };
};
