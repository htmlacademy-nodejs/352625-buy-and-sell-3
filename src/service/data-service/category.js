'use strict';

const {db} = require(`./../../data/db`);
const {Pagination} = require(`../constants.js`);


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

  async findOne(categoryId, currentPage = Pagination.DEFAULT_PAGE) {
    const activeCategory = await this._database.Category.findByPk(categoryId, {
      attributes: [`id`, `name`],
      include: {
        model: this._database.Picture,
        as: `picture`,
      }
    });

    const offersByCategory = await this._database.Offer.findAndCountAll({
      attributes: [`id`, `title`, `description`, `created_date`, `sum`],
      distinct: true,
      offset: Pagination.SIZE * (currentPage - 1),
      limit: Pagination.SIZE,
      include: [{
        model: this._database.Picture,
        as: `picture`,
        attributes: [`normal`, `double`],
      }, {
        model: this._database.Category,
        as: `categories`,
        attributes: [],
        through: {attributes: []},
        where: {id: activeCategory.id},
      }, {
        model: this._database.Type,
        as: `type`,
        attributes: [`name`],
      }]
    });

    const offers = [];

    for (const item of offersByCategory.rows) {
      const offer = item.dataValues;
      offer.categories = await this._database.Category.findAll({
        attributes: [`id`, `name`],
        include: {
          model: this._database.Offer,
          as: `offers`,
          attributes: [],
          duplicating: false,
          where: {
            id: item.dataValues.id
          }
        }
      });

      offers.push(offer);
    }


    return {
      activeCategory,
      offers: {
        totalItems: offersByCategory.count,
        totalPages: Math.ceil(offersByCategory.count / Pagination.SIZE),
        currentPage,
        items: offers,
      },
    };
  }
}

module.exports = CategoryService;
