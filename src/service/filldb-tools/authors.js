'use strict';

const nanoid = require(`nanoid`);
const bcrypt = require(`bcrypt`);
const saltRounds = 10;

const {Pictures, PASSWORD_LENGTH} = require(`./constants.js`);

const {getUniqueItem, getPicturesByType} = require(`./utils.js`);

const getAuthors = async (users, pictures) => {
  const avatarPictures = getPicturesByType(pictures, Pictures.AVATAR);

  return await Promise.all(users
    .map(async (user) => {
      const [name, emailPrefix] = user.split(`, `);
      const [firstname, lastname] = name.split(` `);

      const email = `${emailPrefix}@local.com`;
      const password = await bcrypt.hash(nanoid(PASSWORD_LENGTH), saltRounds);
      const avatarId = pictures.indexOf(getUniqueItem(avatarPictures)) + 1;

      return {
        firstname,
        lastname,
        email,
        password,
        [`picture_id`]: avatarId,
      };
    }));
};

module.exports = getAuthors;
