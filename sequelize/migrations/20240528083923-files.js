'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE files (
      file_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      file_name STRING NOT NULL,
      folder_id UUID,
      organization_name STRING,
      size INT NOT NULL,
      type STRING NOT NULL,
      path STRING NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
      created_by UUID NOT NULL,
      modified_at TIMESTAMP NULL DEFAULT NULL,
      modified_by UUID,
      FOREIGN KEY (folder_id) REFERENCES folders(folder_id) ON DELETE CASCADE,
      FOREIGN KEY (organization_name) REFERENCES organizations(organization_name) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
  );    
  `);
  },
};
