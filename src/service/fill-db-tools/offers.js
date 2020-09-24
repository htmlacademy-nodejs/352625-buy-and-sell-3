'use strict';

const {Pictures} = require(`./constants.js`);

const {SumRestrict} = require(`./../cli/constants.js`);

const {getRandomItem, getUniqueItem, getSomeSentences, getDate, getPicturesByType} = require(`./utils.js`);

const {getRandomInt} = require(`./../utils.js`);

const getOffers = (count, sentences, titles, authors, types, pictures) => {
  const offers = [];
  const itemPictures = getPicturesByType(pictures, Pictures.ITEM);

  let i = 1;
  do {
    const id = i;
    const authorId = getRandomItem(authors)[0];
    const typeId = getRandomItem(types)[0];
    const pictureId = getUniqueItem(itemPictures)[0];
    const createdDate = getDate();
    const title = getRandomItem(titles);
    const description = getSomeSentences(sentences, 1, 5);
    const sum = getRandomInt(SumRestrict.MIN, SumRestrict.MAX);

    offers.push([
      id,
      ` ${authorId}`,
      ` ${typeId}`,
      ` ${pictureId}`,
      ` '${createdDate}'`,
      ` '${title}'`,
      ` '${description}'`,
      ` ${sum}`,
    ]);
    i++;

  } while (i <= count);

  return offers;
};

module.exports = getOffers;
