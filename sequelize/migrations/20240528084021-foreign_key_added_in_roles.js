'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    ALTER TABLE roles
    ADD COLUMN created_by UUID NOT NULL,
    ADD CONSTRAINT fk_created_by
      FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE;    
  `);
  },
};
