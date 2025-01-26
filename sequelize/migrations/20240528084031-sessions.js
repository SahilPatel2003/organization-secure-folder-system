'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE sessions (
      session_id STRING(40) PRIMARY KEY,
      user_id UUID,
      email STRING NOT NULL,
      token STRING(255) NOT NULL,
      expiration_time TIMESTAMP NOT NULL,
      remember_me BOOL NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  );      
  `);
  },

};
