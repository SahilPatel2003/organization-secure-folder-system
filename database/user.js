module.exports = function makeUsersDb({ pool, createError }) {
  async function registerAdmin({
    organization_name,
    username,
    email,
    hash,
    salt,
  }) {
    try {
      const query1 = `
      INSERT INTO organizations (organization_name,created_by)
      VALUES ($1,$2)
    `;
      await pool.query(query1, [organization_name, email]);

      const query2 = `
    INSERT INTO users (organization_name, username, email, hash, salt, is_admin, user_status) 
VALUES ($1,$2,$3,$4,$5,$6,$7);

  `;
      await pool.query(query2, [
        organization_name,
        username,
        email,
        hash,
        salt,
        true,
        1,
      ]);
    } catch (error) {
      console.log(error);
      throw createError(500, "Database Error: Unable to register admin");
    }
  }

  async function checkIfEmailExists({ email }) {
    try {
      const query = `SELECT COUNT(*) AS count FROM organizations WHERE created_by = $1`;
      const { rows } = await pool.query(query, [email]);
      return rows.count > 0;
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to check email existence");
    }
  }

  async function checkIfOrganizationNameExists({ organization_name }) {
    try {
      const query =
        "SELECT COUNT(*) AS count FROM organizations WHERE organization_name = $1";
      const { rows } = await pool.query(query, [organization_name]);
      return rows.count > 0;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to check organization name existence"
      );
    }
  }

  async function registerUser({
    organization_name,
    role_id,
    email,
    created_by,
  }) {
    try {
      const query = `
        INSERT INTO users (organization_name, role_id, email, created_by)
        VALUES ($1, $2, $3, $4);
    `;
      await pool.query(query, [organization_name, role_id, email, created_by]);
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to register user");
    }
  }

  async function updateUser({ username, hash, salt, user_id }) {
    try {
      const updateQuery = `
      UPDATE users
      SET username = $1, hash = $2, salt = $3, user_status = $4, invitation_accepted_at = NOW(),modified_at = NOW()
      WHERE user_id = $5;
  `;

      await pool.query(updateQuery, [username, hash, salt, 1, user_id]);
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to update user");
    }
  }

  async function getUserDetailsUsingEmailAndOrganization_name({
    email,
    organization_name,
  }) {
    try {
      const query = `
        SELECT * FROM users WHERE email = $1 AND organization_name = $2
      `;
      const { rows: userRows } = await pool.query(query, [
        email,
        organization_name,
      ]);
      return userRows;
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to fetch user details");
    }
  }

  async function blockUser({ blocked_user_id }) {
    try {
      const updateQuery = `
        UPDATE users
        SET user_status = 2,modified_at = NOW()
        WHERE user_id = $1;
      `;
      await pool.query(updateQuery, [blocked_user_id]);
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to block user");
    }
  }

  async function getUserDetail({ user_id }) {
    try {
      const userQuery = `SELECT * FROM users WHERE user_id = $1`;
      const { rows } = await pool.query(userQuery, [user_id]);
      return rows;
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to fetch user details");
    }
  }

  async function updateRoleOfUserByAdmin({ user_id, role_id }) {
    try {
      const updateUserQuery = `
        UPDATE users 
        SET role_id = $1,modified_at = NOW() 
        WHERE user_id = $2;
      `;
      await pool.query(updateUserQuery, [role_id, user_id]);
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to update user role");
    }
  }

  async function changePassword({ hash, salt, email, organization_name }) {
    try {
      const query = `
        UPDATE users 
        SET hash = $1, salt = $2,is_password_changed = true,modified_at = NOW()
        WHERE email = $3 AND organization_name=$4;
      `;
      await pool.query(query, [hash, salt, email, organization_name]);
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to change password");
    }
  }

  async function getAllUsers() {
    try {
      const query = `
        SELECT user_id, organization_name, role_id, username, email, user_status, invitation_accepted_at 
        FROM users
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to retrieve all users");
    }
  }

  async function getEmailsByOrganization({ organization_name }) {
    try {
      const query = `
        SELECT email
        FROM users
        WHERE organization_name = $1
      `;
      const { rows } = await pool.query(query, [organization_name]);
      return rows;
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to retrieve emails");
    }
  }

  async function getAssignedUserEmailAndUsername({ assigned_user_id }) {
    try {
      const query = `
        SELECT email, username FROM users WHERE user_id = $1
      `;
      const { rows } = await pool.query(query, [assigned_user_id]);
      return rows;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to get assigned user details"
      );
    }
  }

  async function setPasswordChanged({ organization_name, email }) {
    try {
      const passwordChangedQuery = `
        UPDATE users 
        SET is_password_changed = false ,modified_at = NOW()
        WHERE organization_name = $1 AND email = $2;
      `;
      await pool.query(passwordChangedQuery, [organization_name, email]);
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to update user role");
    }
  }

  return Object.freeze({
    registerAdmin,
    checkIfEmailExists,
    checkIfOrganizationNameExists,
    registerUser,
    updateUser,
    getUserDetailsUsingEmailAndOrganization_name,
    blockUser,
    getUserDetail,
    updateRoleOfUserByAdmin,
    changePassword,
    getAllUsers,
    getEmailsByOrganization,
    getAssignedUserEmailAndUsername,
    setPasswordChanged,
  });
};
