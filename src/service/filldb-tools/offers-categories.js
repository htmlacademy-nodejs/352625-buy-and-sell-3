'use strict';

const {Categories} = require(`./constants.js`);

const {getUniqueItem, getRandomInt} = require(`./utils.js`);

const getOffersCategories = (offers, categories) => {

  const offersCategories = [];

  for (const offer of offers) {
    const categoriesIds = categories.map((item, index) => index + 1);
    const categoriesQuantity = getRandomInt(Categories.MIN, Categories.MAX);

    let i = 1;
    do {
      const offerId = offers.indexOf(offer) + 1;
      const categoryId = getUniqueItem(categoriesIds);

      offersCategories.push({
        [`offer_id`]: offerId,
        [`category_id`]: categoryId,
      });

      i++;
    } while (i <= categoriesQuantity);
  }

  return offersCategories;
};

module.exports = getOffersCategories;
