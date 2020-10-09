'use strict';

const {Router} = require(`express`);

const {Empty, PathName} = require(`./../routes/constants.js`);
const {HttpCode} = require(`./../cli/constants.js`);
const {getCategories} = require(`./utils/categories.js`);

const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const categoriesRouter = new Router();

categoriesRouter.get(`/`, async (req, res) => {
  try {
    const data = await getCategories();

    res.json(data);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.OFFERS);
    logger.error(`Error occurs: ${error}`);
  }
  logger.debug(`${req.method} /${PathName.CATEGORIES}${req.url} --> res status code ${res.statusCode}`);
});

module.exports = categoriesRouter;
