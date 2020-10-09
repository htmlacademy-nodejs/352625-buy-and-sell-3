'use strict';

const {Router} = require(`express`);

const {PathName} = require(`./../routes/constants.js`);
const {getSearch} = require(`./utils/search.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const searchRouter = new Router();

searchRouter.get(`/`, async (req, res) => {
  try {
    const typingData = req.query.query;
    let data = await getSearch(typingData);

    if (typingData === ``) {
      data = [];
    }

    res.json(data);
    logger.debug(`${req.method} /${PathName.SEARCH}${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = searchRouter;
