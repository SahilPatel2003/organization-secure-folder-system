module.exports = function makeMoveFolder({
  foldersDb,
  rolesDb,
  usersDb,
  jwt,
  createError,
  Joi,
}) {
  return async function moveFolderByUser(
    source_folder_name,
    destination_folder_name,
    organization_name,
    token
  ) {
    const data = jwt.decode(token);

    const folderDataSchema = Joi.object({
      source_folder_name: Joi.string().max(255).required(),
      destination_folder_name: Joi.string().max(255).required(),
      organization_name: Joi.string().max(255).required(),
    });

    const { error, value } = folderDataSchema.validate({
      source_folder_name,
      destination_folder_name,
      organization_name,
    });

    if (error) {
      throw createError(400, `Invalid data,${error.details[0].message}`);
    }

    const { user_id, role_id, email } = data;

    const userData = await usersDb.getUserDetail({ user_id });
    const is_admin = userData[0].is_admin;

    const sourceFolderResult = await foldersDb.getFolderDetail({
      folder_name: source_folder_name,
      organization_name,
    });

    if (sourceFolderResult.length === 0) {
      throw createError(404, "Source folder not found.");
    }

    const sourceFolderId = sourceFolderResult[0].folder_id;

    const destinationFolderResult = await foldersDb.getFolderDetail({
      folder_name: destination_folder_name,
      organization_name,
    });

    if (destinationFolderResult.length === 0) {
      throw createError(404, "Destination folder not found.");
    }
    const destinationFolderId = destinationFolderResult[0].folder_id;

    const sourceParentFolder = sourceFolderResult[0].parent_folder;

    if (sourceParentFolder !== "root")
      await foldersDb.removeFolderFromParentFolder({
        folder_id:sourceFolderId,
        email,
        parent_folder:sourceParentFolder,
      });

    await foldersDb.addFolderAsChildIntoDestinationParentFolder({
      source_folder_id: sourceFolderId,
      email,
      destination_folder_id: destinationFolderId,
    });

    await foldersDb.setDestinationParentFolderForMovedFolder({
      destination_folder_id: destinationFolderId,
      email,
      source_folder_id: sourceFolderId,
    });

    const raw2 = await rolesDb.getRoleIdFromRole_assignmentTableUsingUser_id({
      user_id,
    });
    let raw_id_2;
    if (raw2.length) {
      raw_id_2 = raw2[0].role_id;
    }

    if (!is_admin) {
      const role_detail = await rolesDb.getRoleDetail({ role_id });
      const { folders } = role_detail[0];

      const check = await hasPermissionForParent(destinationFolderId, folders);

      if (!check) await removeFolderFromRoles(role_id, source_folder_name);

      if (raw_id_2) {
        const role_detail = await rolesDb.getRoleDetail({ role_id: raw_id_2 });
        const { folders } = role_detail[0];

        const check = await hasPermissionForParent(
          destinationFolderId,
          folders
        );
        if (!check) await removeFolderFromRoles(raw_id_2, source_folder_name);
      }
    }
  };

  async function removeFolderFromRoles(role_id, source_folder_name) {
    const role_detail = await rolesDb.getRoleDetail({ role_id });
    const { folders } = role_detail[0];

    const currentFolders = folders;

    const foldersArray = currentFolders.split(",");

    const folderIndex = foldersArray.indexOf(source_folder_name);
    if (folderIndex !== -1) {
      foldersArray.splice(folderIndex, 1);

      const updatedFolders = foldersArray.join(",");

      await rolesDb.deleteFolderFromRoleTableMovedByUserBecauseOnlyReadPermissionAssignedToFolder(
        { updated_folders: updatedFolders, role_id }
      );
    }
  }

  async function hasPermissionForParent(parentFolderId, findChildren) {
    let currentFolderId = parentFolderId;

    while (currentFolderId !== "root") {
      const folder_detail = await foldersDb.getFolderDetailUsingId({
        folder_id: currentFolderId,
      });
      const { folder_name, parent_folder } = folder_detail[0];

      try {
        if (findChildren.includes(folder_name)) {
          return true;
        }
        currentFolderId = parent_folder;
      } catch (error) {
        throw createError(
          500,
          "Internal Server Error: Unable to check parent folder."
        );
      }
    }

    return false;
  }
};
