'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class Offer extends Model {}
  Offer.init({
    [`id`]: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    [`title`]: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    [`description`]: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    [`created_date`]: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    [`sum`]: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
  });

  return Offer;
};
