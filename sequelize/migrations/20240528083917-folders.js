'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE folders (
      folder_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organization_name STRING,
      folder_name STRING NOT NULL,
      parent_folder STRING(40),
      childrens JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
      created_by UUID NOT NULL,
      modified_at TIMESTAMP NULL DEFAULT NULL,
      modified_by STRING,
      FOREIGN KEY (organization_name) REFERENCES organizations(organization_name) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
  );    
  `);
  },

};
