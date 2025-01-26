module.exports = function makeRolesDb({ pool, createError }) {
  async function addRole({
    organization_name,
    name,
    description,
    permissions,
    folders,
    created_by,
  }) {
    try {
      const query = `
        INSERT INTO roles (organization_name, name, description, permissions, folders, created_by)
        VALUES ($1, $2, $3, $4, $5, $6);
      `;
      await pool.query(query, [
        organization_name,
        name,
        description,
        permissions,
        folders,
        created_by,
      ]);
    } catch (error) {
      console.log(error);
      throw createError(500, "Database Error: Unable to add role");
    }
  }

  async function getRoleDetail({ role_id }) {
    try {
      const roleQuery = `SELECT * FROM roles WHERE role_id = $1`;
      const { rows } = await pool.query(roleQuery, [role_id]);
      return rows;
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to get role detail");
    }
  }

  async function getAllRolesDetail({ organization_name }) {
    try {
      const roleQuery = `SELECT * FROM roles WHERE organization_name = $1`;
      const { rows } = await pool.query(roleQuery, [organization_name]);
      return rows;
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to get roles detail");
    }
  }

  async function assignedRoleDetail({
    assigned_user_id,
    user_id,
    role_id,
    expiration_time,
    organization_name,
  }) {
    try {
      const query = `
        INSERT INTO role_assignments (user_id, assigned_by, role_id, organization_name, expiration_time)
        VALUES ($1, $2, $3, $4, $5);
      `;

      await pool.query(query, [
        assigned_user_id,
        user_id,
        role_id,
        organization_name,
        expiration_time
      ]);
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to assign role");
    }
  }

  async function deleteExpiredTimeRolesFromRole_assignmentTable() {
    try {
      const deleteExpireRolesQuery = `
  DELETE FROM role_assignments
  WHERE expiration_time  <= CURRENT_TIMESTAMP ;
`;

      await pool.query(deleteExpireRolesQuery);
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to delete expired roles");
    }
  }

  async function getRoleIdFromRole_assignmentTableUsingUser_id({ user_id }) {
    try {
      const query = `
        SELECT role_id FROM role_assignments WHERE user_id = $1
      `;
      const { rows: raw2 } = await pool.query(query, [user_id]);
      return raw2;
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to get role ID");
    }
  }

  async function deleteFolderFromRoleTableMovedByUserBecauseOnlyReadPermissionAssignedToFolder({
    updated_folders,
    role_id,
  }) {
    try {
      const updateFoldersQuery = `
        UPDATE roles
        SET folders = $1,modified_at = NOW()
        WHERE role_id = $2;
      `;
      await pool.query(updateFoldersQuery, [
        JSON.stringify(updated_folders),
        role_id,
      ]);
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to update folders");
    }
  }

  return Object.freeze({
    addRole,
    getRoleDetail,
    assignedRoleDetail,
    deleteExpiredTimeRolesFromRole_assignmentTable,
    getRoleIdFromRole_assignmentTableUsingUser_id,
    deleteFolderFromRoleTableMovedByUserBecauseOnlyReadPermissionAssignedToFolder,
    getAllRolesDetail,
  });
};
