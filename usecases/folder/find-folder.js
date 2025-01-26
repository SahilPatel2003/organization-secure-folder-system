module.exports = function makeFindFolder({
  foldersDb,
  organizationsDb,
  createError,
  Joi,
}) {
  return async function findFolder(organization_name, folder_id) {
    const schema = Joi.object({
      organization_name: Joi.string().max(255).required(),
      folder_id: Joi.string()
        .guid({ version: ["uuidv4", "uuidv5"] })
        .required(),
    });

    const { error, value } = schema.validate({ organization_name, folder_id });

    if (error) {
      throw createError(400, `Invalid data,${error.details[0].message}`);
    }

    const organization = await organizationsDb.getOrganizationDetail({
      organization_name,
    });

    if (organization.length === 0) {
      throw createError(404, "Organization not found");
    }

    const folder_detail = await foldersDb.getFolderDetailUsingId({ folder_id });

    if (folder_detail.length === 0) {
      throw createError(404, "Folder not found");
    }

    return folder_detail[0];
  };
};
