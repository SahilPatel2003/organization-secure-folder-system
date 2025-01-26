module.exports = function makeRemoveAllFiles({
  filesDb,
  foldersDb,
  createError,
  Joi,
}) {
  return async function removeAllFile(folder_name, organization_name) {
    const folderAndOrganizationSchema = Joi.object({
      folder_name: Joi.string().max(255).required(),
      organization_name: Joi.string().max(255).required(),
    });

    const { error, value } = folderAndOrganizationSchema.validate({
      folder_name,
      organization_name,
    });
    if (error) {
      throw createError(400, `Invalid data,${error.details[0].message}`);
    }

    const result = await foldersDb.getFolderDetail({
      folder_name,
      organization_name,
    });

    if (result.length === 0) {
      throw createError(404, "The folder not found.");
    }

    const folder_id = result[0].folder_id;

    await filesDb.deleteAllFiles({ folder_id });
  };
};
