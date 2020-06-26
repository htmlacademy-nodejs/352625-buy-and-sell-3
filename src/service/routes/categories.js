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

    const result = [...(new Set(data
      .map((elem) => elem.category || Empty.DATA).flat()
      .map((category) => JSON.stringify(category))
    ))].map((text) => JSON.parse(text));

    if (result === [Empty.DATA]) {
      res.json(Empty.CATEGORIES);
    } else {
      res.json(result);
    }

  } catch (error) {
    res.status(500).json(Empty.OFFERS);
    logger.error(`Error occurs: ${error}`);
  }
  logger.debug(`${req.method} /${PathName.CATEGORIES}${req.url} --> res status code ${res.statusCode}`);
});

module.exports = categoriesRouter;
