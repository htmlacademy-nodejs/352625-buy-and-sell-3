'use strict';

const {Comments} = require(`./constants.js`);

const {getRandomInt, getRandomItem, getDate} = require(`./utils.js`);

const getComments = (offers, authors, commentsSentences) => {
  const authorsIds = authors.map((author, index) => index + 1);

  const comments = [];

  for (const offer of offers) {
    const commentsQuantity = getRandomInt(Comments.MIN, Comments.MAX);
    let i = 1;

    do {
      comments.push({
        [`text`]: getRandomItem(commentsSentences),
        [`created_date`]: getDate(),
        [`author_id`]: getRandomItem(authorsIds),
        [`offer_id`]: offers.indexOf(offer) + 1,
      });
      i++;

    } while (i <= commentsQuantity);
  }
  return comments;
};

module.exports = getComments;
