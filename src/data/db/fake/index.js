'use strict';

require(`dotenv`).config();

const {getDbConnection, createDb} = require(`../utils.js`);
const initModels = require(`../models`);
const {getLogger} = require(`../../../service/logger.js`);

const logger = getLogger();

const FAKE_DB_NAME = `test_database`;

const mainConnection = getDbConnection(`postgres`);
const fakeSequelize = getDbConnection(FAKE_DB_NAME);

const {
  Type,
  Picture,
  Author,
  Category,
  Offer,
  OfferCategory,
  Comment,
} = initModels(fakeSequelize);


const initDb = async (content, orm) => {
  try {
    await createDb(FAKE_DB_NAME, mainConnection);
    logger.info(`The database ${FAKE_DB_NAME} is created.`);

    await orm.sync({force: true});
    logger.info(`The database structure is created.`);

    await Type.bulkCreate(content.types);
    await Picture.bulkCreate(content.pictures);
    await Author.bulkCreate(content.authors);
    await Category.bulkCreate(content.categories);
    await Offer.bulkCreate(content.offers);
    await OfferCategory.bulkCreate(content.offersCategories);
    await Comment.bulkCreate(content.comments);

    logger.info(`The database is filled with mocks.`);
  } catch (error) {
    logger.error(`Something is going wrong: ${error}`);
  }
};

const dropDb = async (orm) => {
  try {
    await orm.drop();

    logger.info(`All db tables are dropped.`);
  } catch (error) {
    logger.error(`Something is going wrong: ${error}`);
  }
};

module.exports = {
  fakeDb: {
    Type,
    Picture,
    Author,
    Category,
    Offer,
    OfferCategory,
    Comment,
  },
  initDb,
  dropDb,
  fakeSequelize,
};
