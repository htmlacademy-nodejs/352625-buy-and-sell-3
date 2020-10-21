'use strict';

const {db} = require(`./../../data/db/db.js`);


class CommentService {
  constructor(database = db) {
    this._database = database;
  }

  async findAllByOfferId(offerId) {
    return await this._database.Comment.findAll({
      where: {
        [`offer_id`]: offerId
      }
    });
  }
}

module.exports = CommentService;
