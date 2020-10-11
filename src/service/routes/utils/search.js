'use strict';

const {db} = require(`./../../../data/db/db.js`);

const {Op} = require(`sequelize`);

const {SEARCH_LIMIT} = require(`./../../routes/constants.js`);

const getSearch = async (typingData) => {
  return await db.Offer.findAll({
    limit: SEARCH_LIMIT,
    where: {
      title: {
        [Op.like]: `%${typingData}%`,
      }
    },
    attributes: [`id`, `title`, `description`, `sum`],

    include: [{
      model: db.Picture,
      as: `picture`,
      attributes: [`normal`, `double`],
    }, {
      model: db.Type,
      as: `type`,
      attributes: [`name`],
    }, {
      model: db.Category,
      as: `categories`,
      attributes: [`id`, `name`],
      through: {attributes: []},
    }]
  });
};

module.exports = {getSearch};
