module.exports = function makeMoveFile({
  filesDb,
  foldersDb,
  jwt,
  createError,
  Joi,
}) {
  return async function moveFile(
    file_name,
    destination_folder,
    organization_name,
    source_folder_name,
    token
  ) {
    const data = jwt.decode(token);

    const dataSchema = Joi.object({
      file_name: Joi.string().max(255).required(),
      destination_folder: Joi.string().max(255).required(),
      organization_name: Joi.string().max(255).required(),
      source_folder_name: Joi.string().max(255).required(),
    });

    const { error, value } = dataSchema.validate({
      file_name,
      destination_folder,
      organization_name,
      source_folder_name,
    });

    if (error) {
      throw createError(400, `Invalid data,${error.details[0].message}`);
    }

    const { user_id } = data;

    const sourceFolderResult = await foldersDb.getFolderDetail({
      folder_name: source_folder_name,
      organization_name,
    });

    if (sourceFolderResult.length === 0) {
      throw createError(404, "Source folder not found.");
    }

    const sourceFolderId = sourceFolderResult[0].folder_id;

    const destinationFolderResult = await foldersDb.getFolderDetail({
      folder_name: destination_folder,
      organization_name,
    });

    if (destinationFolderResult.length === 0) {
      throw createError(404, "Destination folder not found.");
    }

    const destinationFolderId = destinationFolderResult[0].folder_id;

    await filesDb.moveFileFromFolder({
      destination_folder_id: destinationFolderId,
      user_id,
      file_name,
      source_folder_id: sourceFolderId,
    });
  };
};
