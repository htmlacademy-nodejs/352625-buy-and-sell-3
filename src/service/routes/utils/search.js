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
    }
  });
};

module.exports = {getSearch};
