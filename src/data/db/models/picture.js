'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class Picture extends Model {}
  Picture.init({
    [`id`]: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    [`type`]: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    [`normal`]: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    [`double`]: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
  });

  return Picture;
};
