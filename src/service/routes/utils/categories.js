'use strict';

const {db} = require(`./../../../data/db/db.js`);

const getCategories = async () => {
  return await db.Category.findAll({
    attributes: [`id`, `name`],
    include: [{
      model: db.Picture,
      as: `picture`,
      attributes: [`id`, `normal`, `double`],
    },
    {
      model: db.Offer,
      as: `offers`,
      attributes: [`id`],
      through: {attributes: []},
    }]
  });
};

module.exports = {getCategories};
