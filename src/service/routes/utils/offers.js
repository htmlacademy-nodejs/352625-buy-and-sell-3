'use strict';

const {db} = require(`./../../../data/db/db.js`);

const getOffers = async () => {
  return await db.Offer.findAll();
};

module.exports = {getOffers};
