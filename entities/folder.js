module.exports = function buildMakeFolderEntity({ Joi, createError }) {
  return async function makeFolderEntity(folderData) {
    const folderSchema = Joi.object({
      organization_name: Joi.string().max(255).required(),
      folder_name: Joi.string().max(255).required(),
      parent_folder: Joi.string().max(255).required(),
      childrens: Joi.array().items(Joi.string().max(40)).allow(null),
      created_at: Joi.date().default(() => new Date()),
      created_by: Joi.string().max(40).required(),
      modified_at: Joi.date().allow(null).default(null),
      modified_by: Joi.string().max(255).allow(null),
    });

    const { error, value } = folderSchema.validate(folderData);

    if (error) {
      throw createError(400, `Invalid folder data,${error.details[0].message}`);
    } else {
      return Object.freeze({
        getOrganizationName: () => value.organization_name,
        getFolderName: () => value.folder_name,
        getParentFolder: () => value.parent_folder,
        getChildren: () => value.childrens,
        getCreatedAt: () => value.created_at,
        getCreatedBy: () => value.created_by,
        getModifiedAt: () => value.modified_at,
        getModifiedBy: () => value.modified_by,
      });
    }
  };
};
