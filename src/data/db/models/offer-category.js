'use strict';

const {Model} = require(`sequelize`);

module.exports = (sequelize) => {
  class OfferCategory extends Model {}
  OfferCategory.init({
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
  });

  return OfferCategory;
};
