'use strict';

const {db} = require(`./../../../data/db/db.js`);

const getCommentsByOfferId = async (id) => {
  return await db.Comment.findAll({
    where: {
      [`offer_id`]: id
    }
  });
};

module.exports = {getCommentsByOfferId};
