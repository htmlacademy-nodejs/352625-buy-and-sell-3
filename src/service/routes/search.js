'use strict';

const {Router} = require(`express`);

const {Empty, PathName} = require(`./../routes/constants.js`);
const getMock = require(`./../mocks-data.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const searchRouter = new Router();

searchRouter.get(`/`, async (req, res) => {
  try {
    const data = await getMock();
    const result = data
      .filter((elem) => elem.title.includes(req.query.query));

    if (result.length === 0 || req.query.query === Empty.DATA) {
      res.json(Empty.SEARCH);
      logger.debug(`${req.method} /${PathName.SEARCH}${req.url} --> res status code ${res.statusCode}`);

    } else {
      res.json(result);
      logger.debug(`${req.method} /${PathName.SEARCH}${req.url} --> res status code ${res.statusCode}`);
    }

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = searchRouter;
