'use strict';

const {Pictures} = require(`./constants.js`);

const insertPictures = (values, typeName, result, count) => {
  let i = count;

  values.map((value, index) => {
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
};

const getPictures = (count, categories, users) => {
  const pictures = [];
  const items = Array(count).fill(``);

  const firstOffersId = 1;
  const firstCategoriesId = count + 1;
  const firstUsersId = firstCategoriesId + categories.length;

  insertPictures(items, Pictures.ITEM, pictures, firstOffersId);
  insertPictures(categories, Pictures.CATEGORY, pictures, firstCategoriesId);
  insertPictures(users, Pictures.AVATAR, pictures, firstUsersId);

  return pictures;
};

module.exports = getPictures;
