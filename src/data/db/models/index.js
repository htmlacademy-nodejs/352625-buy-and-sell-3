'use strict';

const initModels = (orm) => {
  const Type = require(`./type.js`)(orm);
  const Picture = require(`./picture.js`)(orm);
  const Author = require(`./author.js`)(orm);
  const Auth = require(`./auth.js`)(orm);
  const Category = require(`./category.js`)(orm);
  const Offer = require(`./offer.js`)(orm);
  const OfferCategory = require(`./offer-category.js`)(orm);
  const Comment = require(`./comment.js`)(orm);

  Author.belongsTo(Picture, {
    foreignKey: `picture_id`,
    as: `avatar`,
  });

  Author.hasMany(Offer, {
    foreignKey: `author_id`,
  });

  Auth.belongsTo(Author, {
    foreignKey: `author_id`,
    as: `user`,
  });

  Category.belongsTo(Picture, {
    foreignKey: `picture_id`,
    as: `picture`
  });

  Category.belongsToMany(Offer, {
    as: `offers`,
    foreignKey: `category_id`,
    through: `OfferCategory`,
    timestamps: false,
  });

  Offer.belongsToMany(Category, {
    as: `categories`,
    foreignKey: `offer_id`,
    through: `OfferCategory`,
    timestamps: false,
  });

  Offer.hasMany(Comment, {
    foreignKey: `offer_id`,
    as: `comments`,
  });

  Offer.belongsTo(Type, {
    foreignKey: `type_id`,
    as: `type`,
  });

  Offer.belongsTo(Picture, {
    foreignKey: `picture_id`,
    as: `picture`,
  });

  Offer.belongsTo(Author, {
    foreignKey: `author_id`,
    as: `author`,
  });

  Comment.belongsTo(Author, {
    foreignKey: `author_id`,
    as: `author`,
  });

  Comment.belongsTo(Offer, {
    foreignKey: `offer_id`,
    as: `offer`,
  });

  return {
    Type,
    Picture,
    Author,
    Auth,
    Category,
    Offer,
    OfferCategory,
    Comment,
  };
};

module.exports = initModels;
