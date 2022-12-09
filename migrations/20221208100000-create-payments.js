'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      request: {
        type: Sequelize.JSON
      },
      response: {
        type: Sequelize.JSON
      },
      total_price: {
        type: Sequelize.INTEGER
      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updated_at: {
          type: 'TIMESTAMP',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
          allowNull: false,
      },
      deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
      },
    }, {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      deletedAt: 'deleted_at',
  });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  }
};