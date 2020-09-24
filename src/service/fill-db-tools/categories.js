'use strict';

const {Pictures} = require(`./constants.js`);

const {getUniqueItem, getPicturesByType} = require(`./utils.js`);


const getCategories = (categories, pictures) => {
  const categoriesPictures = getPicturesByType(pictures, Pictures.CATEGORY);

  return categories
    .map((category, index) => {
      const pictureId = getUniqueItem(categoriesPictures)[0];

      return [
        index + 1,
        ` '${pictureId}'`,
        ` '${category}'`,
      ];
    });
};

module.exports = getCategories;
