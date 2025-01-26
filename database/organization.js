module.exports = function makeOrganizationsDb({ pool, createError }) {
  async function getOrganizationId({ organization_name }) {
    try {
      const query = `
        SELECT organization_id FROM organizations WHERE organization_name = $1
      `;
      const { rows: orgRows } = await pool.query(query, [organization_name]);
      return orgRows;
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to get organization ID");
    }
  }

  async function getAdminName({ organization_name }) {
    try {
      const adminQuery = `
        SELECT created_by FROM organizations WHERE organization_name = $1
      `;
      const { rows: adminRows } = await pool.query(adminQuery, [
        organization_name,
      ]);
      return adminRows;
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to get admin name");
    }
  }

  async function getOrganizationDetail({ organization_name }) {
    try {
      const query = `SELECT * FROM organizations WHERE organization_name = $1`;
      const { rows: organization } = await pool.query(query, [
        organization_name,
      ]);
      return organization;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to retrieve organization details"
      );
    }
  }

  async function getAllOrganizationDetails() {
    try {
      const query = `SELECT * FROM organizations`;
      const { rows: organizations } = await pool.query(query);
      return organizations;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to retrieve all organization details"
      );
    }
  }

  async function getAllOrganizationNames() {
    try {
      const query = `SELECT organization_name FROM organizations`;
      const { rows: organizations } = await pool.query(query);
      return organizations;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to retrieve all organization names"
      );
    }
  }

  async function getAllUsersFromOrganization({ organization_name }) {
    try {
      const usersQuery = `SELECT user_id,organization_name,role_id,username,email,is_admin,user_status,created_at,created_by,invitation_accepted_at,modified_at FROM users WHERE organization_name = $1`;
      const { rows } = await pool.query(usersQuery, [organization_name]);
      return rows;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to retrieve users from the specified organization"
      );
    }
  }

  return Object.freeze({
    getOrganizationId,
    getAdminName,
    getOrganizationDetail,
    getAllOrganizationDetails,
    getAllOrganizationNames,
    getAllUsersFromOrganization,
  });
};
