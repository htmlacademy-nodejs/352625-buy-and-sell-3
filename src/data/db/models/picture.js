'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class Picture extends Model {}
  Picture.init({
    [`id`]: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    [`type`]: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    [`normal`]: {
      type: DataTypes.STRING,
    },
    [`double`]: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
  });

  return Picture;
};
