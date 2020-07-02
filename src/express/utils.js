'use strict';

const {URL_API} = require(`./../service/cli/constants.js`);
const {PathName, SEARCH_PARAM} = require(`./../service/routes/constants.js`);

const UriApi = {
  OFFERS: `${URL_API}/${PathName.OFFERS}`,
  CATEGORIES: `${URL_API}/${PathName.CATEGORIES}`,
  AUTH: `${URL_API}/${PathName.AUTH}`,
  SEARCH: `${URL_API}/${PathName.SEARCH}/${SEARCH_PARAM}`,
};

const Items = {
  FRESH: 4,
  MOST_DISCUSSED: 4,
};

const getOffersByCategory = (offers, category) => {
  return offers
    .filter((offer) => offer.category
      .map((item) => item.id)
      .includes(category.id));
};

const getCategoryById = (categories, id) => {
  return categories.filter((category) => category.id === id)[0];
};

const getFreshItems = (offers, count = Items.FRESH) => {
  const sortedData = offers.sort((a, b) => b.createdDate.machine - a.createdDate.machine);

  if (count >= offers.length) {
    return sortedData;
  } else {
    return sortedData.slice(0, count);
  }
};

const getMostDiscussedItems = (offers, count = Items.MOST_DISCUSSED) => {
  const sortedData = offers.sort((a, b) => b.comments.length - a.comments.length);

  if (count >= offers.length) {
    return sortedData;
  } else {
    return sortedData.slice(0, count);
  }
};

module.exports = {
  UriApi,
  getOffersByCategory,
  getCategoryById,
  getFreshItems,
  getMostDiscussedItems,
};
