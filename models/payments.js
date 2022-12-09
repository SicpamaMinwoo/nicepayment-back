'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Payments.init({
    request: DataTypes.JSON,
    response: DataTypes.JSON,
    total_price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Payments',
    tableName: 'payments',
    timestamps: true,
    modelName: 'ReceiptPrinters',
    tableName: 'receipt_printers',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return Payments;
};