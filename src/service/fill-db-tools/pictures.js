'use strict';

const {Pictures} = require(`./constants.js`);

const insertPictures = (values, typeName, count) => {
  const result = [];
  let i = count;

  values.forEach((value, index) => {
    const id = index + 1;
    const type = typeName;
    const normal = id < 10 ? `${type}0${id}.jpg` : `${type}${id}.jpg`;
    const double = id < 10 ? `${type}0${id}@2x.jpg` : `${type}${id}@2x.jpg`;

    result.push([
      i,
      ` '${type}'`,
      ` '${normal}'`,
      ` '${double}'`,
    ]);

    i++;
  });

  return result;
};

const getPictures = (count, categories, users) => {
  const items = Array(count).fill(``);

  const firstItemCount = 1;
  const firstCategoryCount = count + 1;
  const firstUserCount = firstCategoryCount + categories.length;

  const itemsValues = insertPictures(items, Pictures.ITEM, firstItemCount);
  const categoriesValues = insertPictures(categories, Pictures.CATEGORY, firstCategoryCount);
  const usersValues = insertPictures(users, Pictures.AVATAR, firstUserCount);

  return itemsValues.concat(categoriesValues, usersValues);
};

module.exports = getPictures;
