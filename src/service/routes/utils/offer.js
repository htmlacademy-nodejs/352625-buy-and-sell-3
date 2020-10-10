'use strict';

const {db} = require(`./../../../data/db/db.js`);

const getOffer = async (offerId) => {
  return await db.Offer.findByPk(offerId, {
    attributes: [`id`, `title`, `description`, `created_date`, `sum`],
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

      include: {
        model: db.Picture,
        as: `picture`,
        attributes: [`normal`, `double`],
      }
    }, {
      model: db.Comment,
      as: `comments`,
      attributes: [`id`, `text`, `author_id`],

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
    }, {
      model: db.Author,
      as: `author`,
      attributes: [`id`, `firstname`, `lastname`, `email`],
    }]
  });
};

module.exports = {getOffer};
