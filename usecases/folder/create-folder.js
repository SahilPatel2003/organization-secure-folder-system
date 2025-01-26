const { makeFolderEntity } = require("../../entities");

module.exports = function makeAddFolder({ foldersDb, jwt, createError }) {
  return async function addFolder(
    folder_name,
    parent_folder,
    organization_name,
    token
  ) {
    const data = jwt.decode(token);

    const { user_id, email } = data;

    let parent_folder_id = parent_folder;
    if (parent_folder != "root" && parent_folder !== "") {
      const result1 = await foldersDb.getParentFolderDetail({
        parent_folder,
        organization_name,
      });

      if (result1.length === 0) {
        throw createError(404, "Parent folder not found.");
      }

      parent_folder_id = result1[0].folder_id;
    }

    const folderData = {
      organization_name,
      folder_name,
      parent_folder: parent_folder_id,
      childrens: [],
      created_by: user_id,
    };

    const folderEntity = await makeFolderEntity(folderData);

    const result = await foldersDb.getFolderDetail({
      folder_name,
      organization_name,
    });

    if (result.length > 0) {
      throw createError(
        409,
        "You don't have permission to create this resource because it already exists."
      );
    }

    await foldersDb.insertFolderDetails({
      organization_name: folderEntity.getOrganizationName(),
      folder_name: folderEntity.getFolderName(),
      parent_folder: folderEntity.getParentFolder(),
      childrens: "[]",
      created_by: folderEntity.getCreatedBy(),
    });
    if (parent_folder_id !== "root");
    {
      const result = await foldersDb.getFolderDetailAfterCreated({
        folder_name,
        organization_name,
      });

      if (parent_folder != "root") {
        await foldersDb.addFolderAsChildrenIntoParent({
          folder_id: result[0].folder_id,
          email,
          parent_folder_id,
        });
      }
    }
  };
};
