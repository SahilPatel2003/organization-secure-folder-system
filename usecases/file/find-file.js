module.exports = function makeFindFile({
  filesDb,
  foldersDb,
  organizationsDb,
  createError,
  Joi,
}) {
  return async function findFile(organizationName, folder_name, file_name) {
    const folderAndFileSchema = Joi.object({
      organizationName: Joi.string().max(255).required(),
      folder_name: Joi.string().max(255).required(),
      file_name: Joi.string().max(255).required(),
    });

    const dataToValidate = {
      organizationName,
      folder_name,
      file_name,
    };

    const { error, value } = folderAndFileSchema.validate(dataToValidate);

    if (error) {
      throw createError(400, `Invalid data,${error.details[0].message}`);
    }

    const organization = await organizationsDb.getOrganizationDetail({
      organization_name: organizationName,
    });

    if (organization.length === 0) {
      throw createError(404, "Organization not found");
    }

    const folder_detail = await foldersDb.getFolderDetail({
      folder_name,
      organization_name: organizationName,
    });

    if (folder_detail.length == 0) {
      throw createError(404, "folder not found");
    }

    const files_detail = await filesDb.getFile({
      file_name,
      folder_id: folder_detail[0].folder_id,
    });

    if (files_detail.length == 0) {
      throw createError(404, "No file found in the folder.");
    }
    return files_detail[0];
  };
};
