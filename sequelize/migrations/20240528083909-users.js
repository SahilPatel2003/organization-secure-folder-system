'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE users (
      user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organization_name STRING,
      role_id UUID,
      username STRING(255),
      email STRING NOT NULL,
      hash STRING,
      salt STRING,
      is_admin BOOL DEFAULT FALSE,
      user_status INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT current_timestamp(),
      created_by UUID,
      invitation_accepted_at TIMESTAMPTZ,
      modified_at TIMESTAMPTZ NULL DEFAULT NULL,
      is_password_changed BOOL DEFAULT FALSE,
      remember_me BOOL DEFAULT FALSE,
      FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (organization_name) REFERENCES organizations(organization_name) ON DELETE CASCADE,
      FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL
  );  
  `);
  },
};
