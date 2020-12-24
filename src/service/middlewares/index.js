'use strict';

const passProperParam = require(`./pass-proper-param.js`);
const isAuth = require(`./is-auth.js`);
const tryToResponse = require(`./try-to-response.js`);
const validateOffer = require(`./validate-offer.js`);
const validateComment = require(`./validate-comment.js`);
const validateUser = require(`./validate-user.js`);
const isExist = require(`./is-exist.js`);

module.exports = {
  passProperParam,
  isAuth,
  tryToResponse,
  validateOffer,
  validateComment,
  validateUser,
  isExist,
};
