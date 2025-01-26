module.exports = function makeFindFolderNameWithOrganization({
  foldersDb,
  organizationsDb,
  createError,
  Joi,
}) {
  return async function findFolderNameWithOrganization(
    organization_name,
    folder_name_prefix,
    from_index,
    to_index
  ) {
    const schema = Joi.object({
      organization_name: Joi.string().max(255).required(),
    });

    const { error, value } = schema.validate({
      organization_name,
    });

    if (error) {
      throw createError(400, `Invalid data,${error.details[0].message}`);
    }

    const result = organizationsDb.getAdminName({ organization_name });

    if (result.length === 0) throw createError(404, "Organization not found");

    if (from_index !== undefined && from_index !== "") {
      from_index = parseInt(from_index, 10);
      if (isNaN(from_index) || from_index < 0) {
        throw createError(400, "Invalid from_index specified");
      }
    } else {
      from_index = 0;
    }

    const { total_folders } = await foldersDb.getTotalFoldersCount({
      organization_name,
    });

    if (to_index !== undefined && to_index !== "") {
      to_index = parseInt(to_index, 10);
      if (isNaN(to_index) || to_index < 0 || to_index < from_index) {
        throw createError(400, "Invalid to_index specified");
      }
    } else {
      to_index = total_folders - 1;
    }

    let folders = [];

    if (total_folders > 0) {
      if (folder_name_prefix) {
        folders = await foldersDb.searchFolderNameWithOrganization({
          folder_name_prefix,
          organization_name,
          from_index,
          to_index,
        });
      } else {
        folders = await foldersDb.getRangeFoldersFromOrganization({
          organization_name,
          from_index,
          to_index,
        });
      }
    }

    if (folders.length === 0) {
      throw createError(
        404,
        "No folder found in the specified range and organization."
      );
    }

    return { folders, total_folders };
  };
};
