'use strict';

const {Router} = require(`express`);

const {Empty, PathName} = require(`./../routes/constants.js`);
const getMock = require(`./../mocks-data.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const categoriesRouter = new Router();

categoriesRouter.get(`/`, async (req, res) => {
  try {
    const data = await getMock();

    const result = Array
      .from(new Set(data
        .map((elem) => elem.category || Empty.DATA)
        .flat()
        .map((item) => JSON.stringify(item))))
      .map((item) => JSON.parse(item));

    if (result === [Empty.DATA]) {
      res.json(Empty.CATEGORIES);
      logger.debug(`${req.method} /${PathName.CATEGORIES}${req.url} --> res status code ${res.statusCode}`);

    } else {
      res.json(result);
      logger.debug(`${req.method} /${PathName.CATEGORIES}${req.url} --> res status code ${res.statusCode}`);
    }

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = categoriesRouter;
