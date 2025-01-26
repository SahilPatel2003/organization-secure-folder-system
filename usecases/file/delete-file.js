module.exports = function makeRemoveFile({
  filesDb,
  foldersDb,
  createError,
  Joi,
}) {
  return async function removeFile(file_name, folder_name, organization_name) {
    const fileDataSchema = Joi.object({
      file_name: Joi.string().max(255).required(),
      folder_name: Joi.string().max(255).required(),
      organization_name: Joi.string().max(255).required(),
    });

    const { error, value } = fileDataSchema.validate({
      file_name,
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
      throw createError(404, "Folder not found.");
    }

    const folder_id = result[0].folder_id;

    const result1 = await filesDb.getFileDetail({ file_name, folder_id });

    if (result1.length === 0) {
      throw createError(404, "File not found in the specified folder.");
    }

    await filesDb.deleteFile({ file_name, folder_id });
  };
};
