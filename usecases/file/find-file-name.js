module.exports = function makeFindFileName({
  filesDb,
  organizationsDb,
  createError,
  Joi,
}) {
  return async function findFileName(
    organization_name,
    file_name_prefix,
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

    const { total_files } = await filesDb.getTotalCountOfFiles({
      organization_name,
    });

    if (to_index !== undefined && to_index !== "") {
      to_index = parseInt(to_index, 10);
      if (isNaN(to_index) || to_index < 0 || to_index < from_index) {
        throw createError(400, "Invalid to_index specified");
      }
    } else {
      to_index = total_files - 1;
    }

    let files = [];

    if (total_files > 0) {
      if (file_name_prefix) {
        files = await filesDb.searchFileNameWithOrganization({
          file_name_prefix,
          organization_name,
          from_index,
          to_index,
        });
      } else {
        files = await filesDb.getRangeFilesFromOrganization({
          organization_name,
          from_index,
          to_index,
        });
      }
    }
    if (files.length === 0) {
      throw createError(404, "No files found with the specified criteria.");
    }

    return { files, total_files };
  };
};
