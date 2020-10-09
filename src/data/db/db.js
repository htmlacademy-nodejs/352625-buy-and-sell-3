'use strict';

const {Sequelize} = require(`sequelize`);

require(`dotenv`).config();

const {getLogger} = require(`./../../../src/service/logger.js`);

const logger = getLogger();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
    }
);

const Type = require(`./models/type.js`)(sequelize);
const Picture = require(`./models/picture.js`)(sequelize);
const Author = require(`./models/author.js`)(sequelize);
const Auth = require(`./models/auth.js`)(sequelize);
const Category = require(`./models/category.js`)(sequelize);
const Offer = require(`./models/offer.js`)(sequelize);
const OfferCategory = require(`./models/offer-category.js`)(sequelize);
const Comment = require(`./models/comment.js`)(sequelize);

Author.belongsTo(Picture, {
  foreignKey: `picture_id`,
  as: `picture`,
});

Author.hasMany(Offer, {
  foreignKey: `author_id`,
});

Author.hasMany(Comment, {
  foreignKey: `comment_id`,
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

const initDb = async (content) => {
  await sequelize.sync({force: true}); // TODO: delete {force: true} in production
  logger.info(`The database structure is created.`);

  await Type.bulkCreate(content.types);
  await Picture.bulkCreate(content.pictures);
  await Author.bulkCreate(content.authors);
  await Auth.bulkCreate(content.auths);
  await Category.bulkCreate(content.categories);
  await Offer.bulkCreate(content.offers);
  await OfferCategory.bulkCreate(content.offersCategories);
  await Comment.bulkCreate(content.comments);

  logger.info(`The database is filled with mocks.`);
};

module.exports = {
  db: {
    Type,
    Picture,
    Author,
    Auth,
    Category,
    Offer,
    Comment,
  },
  initDb,
  sequelize,
};
