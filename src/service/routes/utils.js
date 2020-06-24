'use strict';

const getMock = require(`./../mocks-data.js`);

const getAuth = async (authStatus) => {
  let user = {};
  let userOffers = [];

  if (authStatus) {
    const offers = await getMock();

    user = offers[0].author;
    userOffers = offers.filter((item) => item.author.id === user.id);
  }

  return {status: authStatus, user, userOffers};
};

module.exports = getAuth;
