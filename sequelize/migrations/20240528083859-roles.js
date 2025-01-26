'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE roles (
      role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organization_name STRING,
      name STRING(255) NOT NULL,
      description STRING,
      permissions STRING(10) NOT NULL,
      folders JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp(),
      modified_at TIMESTAMPTZ NULL DEFAULT NULL,
      FOREIGN KEY (organization_name) REFERENCES organizations(organization_name) ON DELETE CASCADE
  );  
  `);
  },
};
