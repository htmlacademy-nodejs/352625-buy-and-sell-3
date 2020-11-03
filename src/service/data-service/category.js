'use strict';

const {db} = require(`./../../data/db`);

const Pagination = {
  SIZE: 4,
  DEFAULT_PAGE: 1,
};

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

    // TODO добавить в каждый оффер его категории
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

    return {
      activeCategory,
      offers: {
        totalItems: offersByCategory.count,
        totalPages: Math.ceil(offersByCategory.count / Pagination.SIZE),
        currentPage,
        items: offersByCategory.rows,
      },
    };
  }
}

module.exports = CategoryService;
