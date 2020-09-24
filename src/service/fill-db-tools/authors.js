'use strict';

const nanoid = require(`nanoid`);

const {Pictures, PASSWORD_LENGTH} = require(`./constants.js`);

const {getUniqueItem, getPicturesByType} = require(`./utils.js`);

const getAuthors = (users, pictures) => {
  const avatarPictures = getPicturesByType(pictures, Pictures.AVATAR);

  return users
    .map((user, index) => {
      const id = index + 1;
      const [name, emailPrefix] = user.split(`, `);
      const [firstName, lastName] = name.split(` `);

      const email = `${emailPrefix}@local.com`;
      const password = nanoid(PASSWORD_LENGTH);
      const avatarId = getUniqueItem(avatarPictures)[0];

      return [
        id,
        ` '${firstName}'`,
        ` '${lastName}'`,
        ` '${email}'`,
        ` '${password}'`,
        ` ${avatarId}`,
      ];
    });
};

module.exports = getAuthors;
