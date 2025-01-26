'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE role_assignments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID,
      assigned_by UUID,
      role_id UUID,
      organization_name STRING,
      assigned_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
      expiration_time TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_by) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
      FOREIGN KEY (organization_name) REFERENCES organizations(organization_name) ON DELETE CASCADE
  );    
  `);
  },

};
