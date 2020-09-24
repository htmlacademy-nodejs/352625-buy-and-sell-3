'use strict';

const {Comments} = require(`./constants.js`);

const {getRandomItem, getDate} = require(`./utils.js`);

const {getRandomInt} = require(`./../utils.js`);

const getComments = (offers, authors, commentsSentences) => {
  const comments = [];
  let commentCount = 1;

  for (const offer of offers) {
    const commentsQuantity = getRandomInt(Comments.MIN, Comments.MAX);
    let i = 1;

    do {
      const id = commentCount;
      const comment = getRandomItem(commentsSentences);
      const createdDate = getDate();
      const authorId = getRandomItem(authors)[0];
      const offerId = offer[0];

      comments.push([
        id,
        ` ${authorId}`,
        ` ${offerId}`,
        ` '${createdDate}'`,
        ` '${comment}'`,
      ]);
      i++;
      commentCount++;

    } while (i <= commentsQuantity);
  }
  return comments;
};

module.exports = getComments;
