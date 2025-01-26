module.exports = function makeRemoveFolder({
  foldersDb,
  jwt,
  createError,
  Joi,
}) {
  return async function removeFolder(folder_name, organization_name, token) {
    const data = jwt.decode(token);

    const folderAndOrganizationSchema = Joi.object({
      folder_name: Joi.string().max(255).required(),
      organization_name: Joi.string().max(255).required(),
    });

    const { error, value } = folderAndOrganizationSchema.validate({
      folder_name,
      organization_name,
    });
    if (error) {
      throw createError(400, `Invalid folder data,${error.details[0].message}`);
    }

    const result = await foldersDb.getFolderDetail({
      folder_name,
      organization_name,
    });

    if (result.length === 0) {
      throw createError(
        404,
        "The folder you are trying to delete was not found"
      );
    }

    const folder_id = result[0].folder_id;

    const { email } = data;

    const parent_folder = result[0].parent_folder;
    if (parent_folder !== "root")
      await updateParentFolderChildren(folder_id, email, parent_folder);

    await deleteFolderAndChildren(folder_id);
    await updateFoldersForOrganization(organization_name, folder_name);

    async function updateFoldersForOrganization(organization_name, folderName) {
      const roles = await foldersDb.findRolesForFolder({ organization_name });

      try {
        for (const role of roles) {
          const { role_id, folders } = role;
          if (folders === null) continue;
          const foldersArray = folders.split(",");
          const folderIndex = foldersArray.indexOf(folderName);

          if (folderIndex !== -1) {
            foldersArray.splice(folderIndex, 1);
            const updatedFoldersString = foldersArray.join(",");

            await foldersDb.deleteFoldersFromRoles({
              updated_folders_string: updatedFoldersString,
              role_id,
            });
          }
        }
      } catch (error) {
        throw createError(500, "Internal Server Error");
      }
    }

    async function deleteFolderAndChildren(folderId) {
      const childFolders = await foldersDb.findFolderUsingParentFolder({
        folderId,
      });
      for (const childFolder of childFolders) {
        await deleteFolderAndChildren(childFolder.folder_id);
      }
      await foldersDb.deleteFolder({ folder_id: folderId });
    }

    async function updateParentFolderChildren(folderId, email, parent_folder) {
      await foldersDb.removeFolderFromParentFolder({
        folder_id: folderId,
        email,
        parent_folder,
      });
    }
  };
};
