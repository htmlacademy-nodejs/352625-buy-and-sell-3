'use strict';

const {Router} = require(`express`);

const {Empty, PathName} = require(`./../routes/constants.js`);
const {HttpCode} = require(`./../cli/constants.js`);
const {getCategories, getCategory} = require(`./utils/categories.js`);

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

categoriesRouter.get(`/:id`, async (req, res) => {
  try {
    let data = null;
    const categoryId = parseInt(req.params.id, 10);

    if (categoryId) {
      data = await getCategory(categoryId);
    }

    if (data) {
      res.json(data);
    } else {
      res.status(HttpCode.BAD_REQUEST).json(Empty.CATEGORY);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = categoriesRouter;
