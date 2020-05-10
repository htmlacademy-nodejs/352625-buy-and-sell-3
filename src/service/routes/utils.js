'use strict';

const fs = require(`fs`);
const {promisify} = require(`util`);
const readFile = promisify(fs.readFile);

const {FILE_NAME} = require(`./../cli/constants.js`);

const getAuth = async (authStatus) => {
  let user = {};
  let userOffers = [];

  if (authStatus) {
    const fileContent = await readFile(FILE_NAME);
    const offers = JSON.parse(fileContent);

    user = offers[0].author;
    userOffers = offers.filter((item) => item.author.id === user.id);
  }

  return {status: authStatus, user, userOffers};
};

module.exports = getAuth;
