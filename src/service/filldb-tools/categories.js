'use strict';

const {Pictures} = require(`./constants.js`);

const {getUniqueItem, getPicturesByType} = require(`./utils.js`);

const getCategories = (categories, pictures) => {
  const categoriesPictures = getPicturesByType(pictures, Pictures.CATEGORY);

  return categories
    .map((category) => ({
      [`name`]: category,
      [`picture_id`]: pictures.indexOf(getUniqueItem(categoriesPictures)) + 1,
    }));
};

module.exports = getCategories;
