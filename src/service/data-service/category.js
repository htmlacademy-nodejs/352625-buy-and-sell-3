'use strict';

const {db} = require(`./../../data/db/db.js`);


class CategoryService {
  constructor(database = db) {
    this._database = database;
  }

  async findAll() {
    return await this._database.Category.findAll({
      attributes: [`id`, `name`],
      include: [{
        model: this._database.Picture,
        as: `picture`,
        attributes: [`id`, `normal`, `double`],
      }, {
        model: this._database.Offer,
        as: `offers`,
        attributes: [`id`],
        through: {attributes: []},
      }]
    });
  }

  async findOne(categoryId) {
    return await this._database.Category.findByPk(categoryId, {
      attributes: [`id`, `name`],
      include: [{
        model: this._database.Offer,
        as: `offers`,
        attributes: [`id`, `title`, `description`, `created_date`, `sum`],
        through: {attributes: []},

        include: [{
          model: this._database.Picture,
          as: `picture`,
          attributes: [`normal`, `double`],
        }, {
          model: this._database.Category,
          as: `categories`,
          attributes: [`id`, `name`],
          through: {attributes: []},
        }, {
          model: this._database.Type,
          as: `type`,
          attributes: [`name`],
        }]

      }, {
        model: this._database.Picture,
        as: `picture`,
      }]
    });
  }
}

module.exports = CategoryService;
