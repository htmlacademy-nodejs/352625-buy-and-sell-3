'use strict';

const {URL_API} = require(`./../service/cli/constants.js`);
const {PathName, SEARCH_PARAM} = require(`./../service/routes/constants.js`);
const moment = require(`moment`);

const UriApi = {
  OFFERS: `${URL_API}/${PathName.OFFERS}`,
  CATEGORIES: `${URL_API}/${PathName.CATEGORIES}`,
  AUTH: `${URL_API}/${PathName.AUTH}`,
  SEARCH: `${URL_API}/${PathName.SEARCH}/${SEARCH_PARAM}`,
};

const getHumanDate = (date) => {
  return moment(date).format(`DD.MM.YYYY, HH:mm`);
};

module.exports = {
  UriApi,
  getHumanDate,
};
