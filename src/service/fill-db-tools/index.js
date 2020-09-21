'use strict';

const {OfferType} = require(`./../cli/constants.js`);

const {Tables} = require(`./constants.js`);

const {insertSqlValues} = require(`./utils.js`);

const getTypes = require(`./types.js`);

const getPictures = require(`./pictures.js`);

const getAuthors = require(`./authors.js`);

const getOffers = require(`./offers.js`);

const getCategories = require(`./categories.js`);

const getOffersCategories = require(`./offers-categories.js`);

const getComments = require(`./comments.js`);

const getSqlContent = (count, sentences, titles, categoriesSentences, users, commentsSentences) => {
  const types = getTypes(OfferType);

  const pictures = getPictures(count, categoriesSentences, users);
  const authors = getAuthors(users, pictures);
  const categories = getCategories(categoriesSentences, pictures);

  const offers = getOffers(count, sentences, titles, authors, types, pictures);
  const offersCategories = getOffersCategories(offers, categories);
  const comments = getComments(offers, authors, commentsSentences);

  let content = insertSqlValues(types, Tables.TYPES);

  content += insertSqlValues(pictures, Tables.PICTURES);
  content += insertSqlValues(authors, Tables.AUTHORS);
  content += insertSqlValues(categories, Tables.CATEGORIES);

  content += insertSqlValues(offers, Tables.OFFERS);
  content += insertSqlValues(offersCategories, Tables.OFFERS_CATEGORIES);
  content += insertSqlValues(comments, Tables.COMMENTS);

  return content;
};

module.exports = getSqlContent;
