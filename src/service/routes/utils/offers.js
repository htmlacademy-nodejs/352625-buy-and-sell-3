'use strict';

const {db, sequelize} = require(`./../../../data/db/db.js`);
const {Items} = require(`./../constants.js`);

const getOffers = async () => {
  return await db.Offer.findAll();
};

const getFreshItems = async (itemsCount = Items.FRESH) => {
  return await db.Offer.findAll({
    attributes: [`id`, `title`, `created_date`, `sum`],

    order: [
      [`created_date`, `desc`]
    ],

    include: [{
      model: db.Category,
      as: `categories`,
      attributes: [`id`, `name`],
      through: {attributes: []},
    }, {
      model: db.Picture,
      as: `picture`,
      attributes: [`normal`, `double`],
    }, {
      model: db.Type,
      as: `type`,
      attributes: [`name`],
    }],

    limit: itemsCount,
  });

};

const getMostDiscussed = async () => {
  return db.Offer.findAll({
    attributes: {
      include: [sequelize.fn(`count`, sequelize.col(`comments.id`)), `count`]
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
    // TODO limit работает не корректно - не разобрался почему
    // limit: itemsCount,
  });
};

const getOffersByAuthorId = async (authorId) => {
  return await db.Offer.findAll({
    attributes: [`id`, `title`, `sum`],
    include: [{
      model: db.Picture,
      as: `picture`,
      attributes: [`normal`, `double`],
    }, {
      model: db.Type,
      as: `type`,
      attributes: [`name`],
    }, {
      model: db.Category,
      as: `categories`,
      attributes: [`id`, `name`],
      through: {attributes: []},
    }, {
      model: db.Comment,
      as: `comments`,
      attributes: [`text`],

      include: {
        model: db.Author,
        as: `author`,
        attributes: [`firstname`, `lastname`],

        include: {
          model: db.Picture,
          as: `avatar`,
          attributes: [`normal`, `double`],
        }
      }
    }],
    where: {
      [`author_id`]: authorId,
    },
  });
};

module.exports = {getOffers, getFreshItems, getMostDiscussed, getOffersByAuthorId};
