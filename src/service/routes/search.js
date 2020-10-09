'use strict';

const {Router} = require(`express`);

const {Empty, PathName} = require(`./../routes/constants.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const searchRouter = new Router();

searchRouter.get(`/`, async (req, res) => {
  try {
    const data = [];

    if (data.length === 0 || req.query.query === Empty.DATA) {
      res.json(Empty.SEARCH);
    } else {
      res.json(data);
    }
    logger.debug(`${req.method} /${PathName.SEARCH}${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = searchRouter;
