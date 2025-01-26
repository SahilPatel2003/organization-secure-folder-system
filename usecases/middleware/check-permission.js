module.exports = function makeCheckPermission({
  usersDb,
  foldersDb,
  rolesDb,
  jwt,
  JWTKey,
  createError,
  Joi,
}) {
  return async function checkPermission(path, token, data) {
    const schema = Joi.object({
      path: Joi.string().required(),
      token: Joi.string().required(),
      data: Joi.object().min(1).required(),
    });

    const { error, value } = schema.validate({
      path,
      token,
      data,
    });

    if (error) {
      throw createError(400, `Invalid data,${error.details[0].message}`);
    }

    await new Promise((resolve, reject) => {
      jwt.verify(token, JWTKey, (err) => {
        if (err) {
          reject(createError(401, "Invalid token"));
        } else {
          resolve();
        }
      });
    });

    const token_data = jwt.decode(token);

    const { user_id, role_id, organization_name } = token_data;

    const userData = await usersDb.getUserDetail({ user_id });
    const is_admin = userData[0].is_admin;

    if (is_admin) return;

    let action;
    let folder_id;

    if (path.includes("createfolder") || path.includes("createFile")) {
      action = 2;
      const { parent_folder } = data;

      if (parent_folder != "root") {
        const result1 = await foldersDb.getFolderDetail({
          folder_name: parent_folder,
          organization_name,
        });

        if (result1.length === 0) {
          throw createError(404, "Parent folder not found.");
        }
        folder_id = result1[0].folder_id;
      } else {
        throw createError(
          403,
          "You don't have permission to access this resource."
        );
      }
    } else if (path.includes("moveFolder") || path.includes("moveFile")) {
      action = 1;
      const { source_folder_name } = data;
      const sourceFolderResult = await foldersDb.getFolderDetail({
        folder_name: source_folder_name,
        organization_name,
      });

      if (sourceFolderResult.length === 0) {
        throw createError(404, "Source folder not found.");
      }

      folder_id = sourceFolderResult[0].folder_id;
    } else if (
      path.includes("deletefolder") ||
      path.includes("deleteFile") ||
      path.includes("deleteAllFiles")
    ) {
      action = 0;
      const { folder_name } = data;
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

      folder_id = result[0].folder_id;
    } else if (
      path.includes("send-email") ||
      path.includes("block-user") ||
      path.includes("role_assignment") ||
      path.includes("change_role")
    ) {
      throw createError(403, "You don't have permission to do this.");
    } else {
      return;
    }

    await rolesDb.deleteExpiredTimeRolesFromRole_assignmentTable();

    const raw1 = await rolesDb.getRoleDetail({ role_id });

    const raw2 = await rolesDb.getRoleIdFromRole_assignmentTableUsingUser_id({
      user_id,
    });

    let permissions, folders;
    if (raw1.length) {
      permissions = raw1[0].permissions;
      folders = raw1[0].folders;
    }

    let permissions1, folders1;
    let raw_id_2;
    if (raw2.length) {
      raw_id_2 = raw2[0].role_id;
      const raw3 = await rolesDb.getRoleDetail({ role_id: raw2[0].role_id });
      permissions1 = raw3[0].permissions;
      folders1 = raw3[0].folders;
    }

    let findChildren = [];

    if (permissions || permissions1) {
      if (permissions && permissions[action] === "1" && !permissions1) {
        findChildren = folders;
      } else if (!permissions && permissions1 && permissions1[action] === "1") {
        findChildren = folders1;
      } else if (
        permissions &&
        permissions[action] === "1" &&
        permissions1 &&
        permissions1[action] === "0"
      ) {
        findChildren = folders;
      } else if (
        permissions &&
        permissions[action] === "0" &&
        permissions1 &&
        permissions1[action] === "1"
      ) {
        findChildren = folders1;
      } else if (
        permissions &&
        permissions[action] === "1" &&
        permissions1 &&
        permissions1[action] === "1"
      ) {
        findChildren = [
          ...new Set(folders.split(",").concat(folders1.split(","))),
        ];
      }
      const isFolderNamePresent = await hasPermissionForParent(
        folder_id,
        findChildren
      );
      if (!isFolderNamePresent) {
        throw createError(
          403,
          "You don't have permission to access this resource."
        );
      }
    } else {
      throw createError(
        403,
        "You don't have permission to access this resource."
      );
    }
  };

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
