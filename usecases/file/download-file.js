module.exports = function makeDownloadFile({
  filesDb,
  foldersDb,
  bucket,
  createError,
  Joi,
}) {
  return async function downloadFileByUser(
    organization_name,
    folder_name,
    file_name
  ) {
    const folderAndOrganizationSchema = Joi.object({
      file_name: Joi.string().max(255).required(),
      folder_name: Joi.string().max(255).required(),
      organization_name: Joi.string().max(255).required(),
    });

    const { error, value } = folderAndOrganizationSchema.validate({
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
      throw createError(404, "Folder not found in the specified organization.");
    }

    const folder_id = result[0].folder_id;

    try {
      const result = await filesDb.getFileDetail({ file_name, folder_id });

      if (result.length === 0) {
        throw createError(404, "File not found in the specified folder.");
      }

      const { type, path } = result[0];
      const pathParts = path.split("/");
      const fileName = pathParts[pathParts.length - 1];

      const file = bucket.file(path);

      const [buffer] = await file.download();

      let res = {};

      if (type === "image/png") res.header = "image/png";
      else if (type === "application/pdf") res.header = "application/pdf";
      else {
        res.header = "text/plain";
      }
      res.fileName = fileName;
      res.buffer = buffer;
      return res;
    } catch (error) {
      throw createError(
        error.statusCode || 500,
        error.message || "Error downloading image"
      );
    }
  };
};
