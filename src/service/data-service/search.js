'use strict';

const {Op} = require(`sequelize`);
const {db} = require(`./../../data/db`);
const {SEARCH_LIMIT} = require(`../constants.js`);


class SearchService {
  constructor(database = db) {
    this._database = database;
  }

  async findSome(typingData, count = SEARCH_LIMIT) {
    return await this._database.Offer.findAll({
      limit: count,
      where: {
        title: {
          [Op.like]: `%${typingData}%`,
        }
      },
      attributes: [`id`, `title`, `description`, `sum`],

      include: [{
        model: this._database.Picture,
        as: `picture`,
        attributes: [`normal`, `double`],
      }, {
        model: this._database.Type,
        as: `type`,
        attributes: [`name`],
      }, {
        model: this._database.Category,
        as: `categories`,
        attributes: [`id`, `name`],
        through: {attributes: []},
      }]
    });
  }
}

module.exports = SearchService;
