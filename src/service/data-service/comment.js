'use strict';

const moment = require(`moment`);
const {db} = require(`./../../data/db`);


class CommentService {
  constructor(database = db) {
    this._database = database;
  }

  async findAll() {
    return await this._database.Comment.findAll();
  }

  async findAllByOfferId(offerId) {
    return await this._database.Comment.findAll({
      where: {
        [`offer_id`]: offerId
      }
    });
  }

  async findOne(commentId) {
    return await this._database.Comment.findByPk(commentId);
  }

  async delete(commentId) {
    await this._database.Comment.destroy({
      where: {
        id: commentId
      }
    });
  }

  async add(formData, offerId, authorId) {
    return await this._database.Comment.create({
      [`text`]: formData[`text`],
      [`created_date`]: moment().toISOString(),
      [`author_id`]: authorId,
      [`offer_id`]: offerId,
    });
  }
}

module.exports = CommentService;
