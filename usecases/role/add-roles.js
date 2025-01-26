const { makeRoleEntity } = require("../../entities");

module.exports = function makeAddRole({ rolesDb, jwt }) {
  return async function addRole(
    name,
    description,
    permissions,
    folders,
    token
  ) {
    const data = jwt.decode(token);

    const { organization_name, user_id } = data;

    const roleData = {
      organization_name,
      name,
      description,
      permissions,
      folders,
      created_by: user_id,
    };

    const roleEntity = await makeRoleEntity(roleData);

    await rolesDb.addRole({
      organization_name: roleEntity.getOrganizationName(),
      name: roleEntity.getName(),
      description: roleEntity.getDescription(),
      permissions: roleEntity.getPermissions(),
      folders: roleEntity.getFolders(),
      created_by: roleEntity.getCreatedBy(),
    });
  };
};
