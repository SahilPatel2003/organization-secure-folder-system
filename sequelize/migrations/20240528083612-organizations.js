'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE organizations (
      organization_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organization_name STRING NOT NULL UNIQUE,
      created_by STRING NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT current_timestamp()
  );     
  `);
  },
};
