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

  async checkAuthorship(commentId, userId) {
    const comment = await this.findOne(commentId);
    const offer = await this._database.Offer.findByPk(comment[`offer_id`]);
    return userId === offer[`author_id`];
  }

  async delete(commentId) {
    await this._database.Comment.destroy({
      where: {
        id: commentId
      }
    });
  }

  async add({text, userId, offerId}) {
    return await this._database.Comment.create({
      text,
      [`created_date`]: moment().toISOString(),
      [`author_id`]: userId,
      [`offer_id`]: offerId,
    });
  }
}

module.exports = CommentService;
