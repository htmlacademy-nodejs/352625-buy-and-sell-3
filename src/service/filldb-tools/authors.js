'use strict';

const nanoid = require(`nanoid`);

const {Pictures, PASSWORD_LENGTH} = require(`./constants.js`);

const {getUniqueItem, getPicturesByType} = require(`./utils.js`);

const getAuthors = (users, pictures) => {
  const avatarPictures = getPicturesByType(pictures, Pictures.AVATAR);

  return users
    .map((user) => {
      const [name, emailPrefix] = user.split(`, `);
      const [firstname, lastname] = name.split(` `);

      const email = `${emailPrefix}@local.com`;
      const password = nanoid(PASSWORD_LENGTH);
      const avatarId = pictures.indexOf(getUniqueItem(avatarPictures)) + 1;

      return {
        firstname,
        lastname,
        email,
        password,
        [`picture_id`]: avatarId,
      };
    });
};

module.exports = getAuthors;
