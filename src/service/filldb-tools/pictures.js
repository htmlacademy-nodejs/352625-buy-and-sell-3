'use strict';

const {Pictures} = require(`./constants.js`);

const insertPictures = (values, typeName) => {
  const result = [];

  values.forEach((value, index) => {
    const id = index + 1;
    const type = typeName;
    const normal = id < 10 ? `${type}0${id}.jpg` : `${type}${id}.jpg`;
    const double = id < 10 ? `${type}0${id}@2x.jpg` : `${type}${id}@2x.jpg`;

    result.push({type, normal, double});
  });

  return result;
};

const getPictures = (count, categories, users) => {
  const items = Array(count).fill(``);

  const itemsValues = insertPictures(items, Pictures.ITEM);
  const categoriesValues = insertPictures(categories, Pictures.CATEGORY);
  const usersValues = insertPictures(users, Pictures.AVATAR);

  return itemsValues.concat(categoriesValues, usersValues);
};

module.exports = getPictures;
