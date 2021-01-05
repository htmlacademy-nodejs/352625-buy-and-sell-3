'use strict';

require(`dotenv`).config();

const initModels = require(`./models`);
const {getDbConnection} = require(`./utils.js`);
const {getLogger} = require(`./../../../src/service/logger.js`);

const logger = getLogger();

const sequelize = getDbConnection(process.env.DB_NAME);

const {
  Type,
  Picture,
  Author,
  Category,
  Offer,
  OfferCategory,
  Comment,
} = initModels(sequelize);


const initDb = async (content, orm) => {
  await orm.sync({force: true}); // TODO: delete {force: true} in production
  logger.info(`The database structure is created.`);

  await Type.bulkCreate(content.types);
  await Picture.bulkCreate(content.pictures);
  await Author.bulkCreate(content.authors);
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
    Category,
    Offer,
    OfferCategory,
    Comment,
  },
  initDb,
  sequelize,
};
