'use strict';

const {Pictures} = require(`./constants.js`);

const {SumRestrict} = require(`./constants.js`);

const {
  getRandomItem,
  getUniqueItem,
  getRandomInt,
  getSomeSentences,
  getDate,
  getPicturesByType
} = require(`./utils.js`);

const getOffers = (count, sentences, titles, authors, types, pictures) => {
  const offers = [];
  const itemPictures = getPicturesByType(pictures, Pictures.ITEM);

  let i = 1;
  do {
    offers.push({
      [`author_id`]: authors.indexOf(getRandomItem(authors)) + 1,
      [`type_id`]: types.indexOf(getRandomItem(types)) + 1,
      [`picture_id`]: pictures.indexOf(getUniqueItem(itemPictures)) + 1,
      [`created_date`]: getDate(),
      [`title`]: getRandomItem(titles),
      [`description`]: getSomeSentences(sentences, 1, 5),
      [`sum`]: getRandomInt(SumRestrict.MIN, SumRestrict.MAX)
    });
    i++;

  } while (i <= count);

  return offers;
};

module.exports = getOffers;
