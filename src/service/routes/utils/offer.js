'use strict';

const {db} = require(`./../../../data/db/db.js`);

const getOffer = async (offerId) => {
  return await db.Offer.findByPk(offerId);
};

module.exports = {getOffer};
