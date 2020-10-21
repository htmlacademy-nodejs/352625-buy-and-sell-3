'use strict';

const {Sequelize} = require(`sequelize`);

require(`dotenv`).config();

const initModels = require(`./models`);
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

const {
  Type,
  Picture,
  Author,
  Auth,
  Category,
  Offer,
  OfferCategory,
  Comment,
} = initModels(sequelize);


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
    OfferCategory,
    Comment,
  },
  initDb,
  sequelize,
};
