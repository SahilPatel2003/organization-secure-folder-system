const { makeFileEntity } = require("../../entities");

module.exports = function makeAddFile({
  filesDb,
  foldersDb,
  jwt,
  bucket,
  createError,
}) {
  return async function addFile(
    file_name,
    path,
    parent_folder,
    organization_name,
    token
  ) {
    let path1;
    let size, type;
    if (path) {
      const pathParts = path.split("/");
      const fileName = pathParts[pathParts.length - 1];
      const folderName = pathParts[pathParts.length - 2];

      const file = bucket.file(`${folderName}/${fileName}`);

      path1 = `${folderName}/${fileName}`;
      await file.getMetadata().then((metadata) => {
        type = metadata[0].contentType;
        size = metadata[0].size;
      });

      if (size > 20 * 1024 * 1024) {
        throw createError(413, "File size exceeds the limit of 20 MB");
      }

      if (
        type !== "image/png" &&
        type !== "application/pdf" &&
        type !== "text/plain"
      ) {
        throw createError(
          415,
          "Unsupported file type. Only PNG images, PDF documents, and plain text files are allowed."
        );
      }
    }
    const folder_detail = await foldersDb.getFolderDetail({
      folder_name: parent_folder,
      organization_name,
    });

    if (folder_detail.length === 0) {
      throw createError(404, "Parent folder not found.");
    }

    const parent_folder_id = folder_detail[0].folder_id;

    const result = await filesDb.getFileDetail({
      file_name,
      folder_id: parent_folder_id,
    });

    if (result.length > 0) {
      throw createError(
        409,
        "You don't have permission to create this resource because it already exists in same folder."
      );
    }

    const data = jwt.decode(token);

    const { user_id } = data;

    const fileData = {
      file_name,
      folder_id: parent_folder_id,
      organization_name,
      size,
      type,
      path: path1,
      created_by: user_id,
    };

    const fileEntity = await makeFileEntity(fileData);

    await filesDb.insertFileDetails({
      file_name: fileEntity.getFileName(),
      folder_id: fileEntity.getFolderId(),
      organization_name: fileEntity.getOrganizationName(),
      size: fileEntity.getSize(),
      type: fileEntity.getType(),
      path: fileEntity.getPath(),
      created_by: fileEntity.getCreatedBy(),
    });
  };
};
