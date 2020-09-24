'use strict';

const {Categories} = require(`./constants.js`);

const {getUniqueItem} = require(`./utils.js`);

const {getRandomInt} = require(`./../utils.js`);


const getOffersCategories = (offers, categories) => {
  const offersCategories = [];

  for (const offer of offers) {
    const categoriesIds = categories.map((item) => item[0]);
    const categoriesQuantity = getRandomInt(Categories.MIN, Categories.MAX);

    let i = 1;
    do {
      const offerId = offer[0];
      const categoryId = getUniqueItem(categoriesIds);

      offersCategories.push([
        offerId,
        ` ${categoryId}`,
      ]);

      i++;
    } while (i <= categoriesQuantity);
  }

  return offersCategories;
};

module.exports = getOffersCategories;
