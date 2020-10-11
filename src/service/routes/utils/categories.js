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

const getCategory = async (categoryId) => {
  return await db.Category.findByPk(categoryId, {
    attributes: [`id`, `name`],
    include: [{
      model: db.Offer,
      as: `offers`,
      attributes: [`id`, `title`, `description`, `created_date`, `sum`],
      through: {attributes: []},

      include: [{
        model: db.Picture,
        as: `picture`,
        attributes: [`normal`, `double`],
      }, {
        model: db.Category,
        as: `categories`,
        attributes: [`id`, `name`],
        through: {attributes: []},
      }, {
        model: db.Type,
        as: `type`,
        attributes: [`name`],
      }]

    }, {
      model: db.Picture,
      as: `picture`,
    }]
  });
};

module.exports = {getCategories, getCategory};
