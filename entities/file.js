module.exports = function buildMakeFileEntity({ Joi, createError }) {
  return async function makeFileEntity(fileData) {
    const fileSchema = Joi.object({
      file_name: Joi.string().max(255).required(),
      folder_id: Joi.string().max(40).required(),
      organization_name: Joi.string().max(255).required(),
      size: Joi.number().integer().required(),
      type: Joi.string().max(50).required(),
      path: Joi.string().max(255).required(),
      created_at: Joi.date().default(() => new Date()),
      created_by: Joi.string().max(40).required(),
      modified_at: Joi.date().allow(null).default(null),
      modified_by: Joi.string().max(40).allow(null),
    });

    const { error, value } = fileSchema.validate(fileData);

    if (error) {
      throw createError(400, `Invalid file data,${error.details[0].message}`);
    } else {
      return Object.freeze({
        getFileName: () => value.file_name,
        getFolderId: () => value.folder_id,
        getOrganizationName: () => value.organization_name,
        getSize: () => value.size,
        getType: () => value.type,
        getPath: () => value.path,
        getCreatedAt: () => value.created_at,
        getCreatedBy: () => value.created_by,
        getModifiedAt: () => value.modified_at,
        getModifiedBy: () => value.modified_by,
      });
    }
  };
};
