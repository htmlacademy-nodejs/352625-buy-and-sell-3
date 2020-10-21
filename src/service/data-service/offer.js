'use strict';

const {db, sequelize} = require(`./../../data/db/db.js`);
const {Items} = require(`../routes/constants.js`);


class OfferService {
  constructor(database = db, orm = sequelize) {
    this._database = database;
    this._orm = orm;
    this._freshItemsCount = Items.FRESH;
    this._mostDiscussedCount = Items.MOST_DISCUSSED;
  }

  async findAll() {
    return await this._database.Offer.findAll();
  }

  async findOne(offerId) {
    return await this._database.Offer.findByPk(offerId, {
      attributes: [`id`, `title`, `description`, `created_date`, `sum`],
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

        include: {
          model: this._database.Picture,
          as: `picture`,
          attributes: [`normal`, `double`],
        }
      }, {
        model: this._database.Comment,
        as: `comments`,
        attributes: [`id`, `text`, `author_id`],

        include: {
          model: this._database.Author,
          as: `author`,
          attributes: [`firstname`, `lastname`],
          include: {
            model: this._database.Picture,
            as: `avatar`,
            attributes: [`normal`, `double`],
          }
        }
      }, {
        model: this._database.Author,
        as: `author`,
        attributes: [`id`, `firstname`, `lastname`, `email`],
      }]
    });
  }

  async findFresh() {
    return await this._database.Offer.findAll({
      attributes: [`id`, `title`, `created_date`, `sum`],

      order: [
        [`created_date`, `desc`]
      ],

      include: [{
        model: this._database.Category,
        as: `categories`,
        attributes: [`id`, `name`],
        through: {attributes: []},
      }, {
        model: this._database.Picture,
        as: `picture`,
        attributes: [`normal`, `double`],
      }, {
        model: this._database.Type,
        as: `type`,
        attributes: [`name`],
      }],

      limit: this._freshItemsCount,
    });
  }

  async findMostDiscussed() {
    return db.Offer.findAll({
      attributes: {
        include: [this._orm.fn(`count`, this._orm.col(`comments.id`)), `count`]
      },

      include: [{
        model: db.Comment,
        as: `comments`,
        attributes: [],
        duplicating: false,
      }, {
        model: db.Picture,
        as: `picture`,
        attributes: [`normal`, `double`],
      }, {
        model: db.Category,
        as: `categories`,
        attributes: [`id`, `name`],
        duplicating: false,
        required: false,
        through: {attributes: []},
      }, {
        model: db.Type,
        as: `type`,
        attributes: [`name`],
      }],
      group: [`Offer.id`, `picture.id`, `categories.id`, `type.id`],

      order: [
        [`count`, `desc`]
      ],
      // TODO limit работает не корректно, стоит убрать из выборки 'model: db.Category', то все становится ok.
      // limit: this._mostDiscussedCount,
    });
  }

  async findAllByAuthorId(authorId) {
    return await this._database.Offer.findAll({
      attributes: [`id`, `title`, `sum`],
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
      }, {
        model: this._database.Comment,
        as: `comments`,
        attributes: [`text`],

        include: {
          model: this._database.Author,
          as: `author`,
          attributes: [`firstname`, `lastname`],

          include: {
            model: this._database.Picture,
            as: `avatar`,
            attributes: [`normal`, `double`],
          }
        }
      }],
      where: {
        [`author_id`]: authorId,
      },
    });
  }
}

module.exports = OfferService;