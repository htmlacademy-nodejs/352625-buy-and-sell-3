'use strict';

const passProperParam = require(`./pass-proper-param.js`);
const tryToResponse = require(`./try-to-response.js`);
const validateOffer = require(`./validate-offer.js`);
const validateComment = require(`./validate-comment.js`);
const validateUser = require(`./validate-user.js`);
const isSomeData = require(`./is-some-data.js`);
const isOwner = require(`./is-owner.js`);
const isUser = require(`./is-user.js`);
const isCommentExist = require(`./is-comment-exist.js`);
const isOfferExist = require(`./is-offer-exist.js`);
const authenticate = require(`./authenticate.js`);

module.exports = {
  passProperParam,
  tryToResponse,
  validateOffer,
  validateComment,
  validateUser,
  isSomeData,
  isOwner,
  isUser,
  isOfferExist,
  isCommentExist,
  authenticate,
};
