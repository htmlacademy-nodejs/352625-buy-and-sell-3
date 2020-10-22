'use strict';

const {Router} = require(`express`);
const {HttpCode, PathName, Empty} = require(`../constants.js`);
const {getLogger} = require(`../../service/logger.js`);

const logger = getLogger();


module.exports = (app, searchService) => {
  const route = new Router();

  app.use(`/${PathName.SEARCH}`, route);

  route.get(`/`, async (req, res) => {
    try {
      const typingData = req.query.query;
      let data = await searchService.findSome(typingData);

      if (typingData === ``) {
        data = Empty.SEARCH;
      }

      res.status(HttpCode.OK).json(data);
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
      logger.error(`Error occurs: ${error}`);
    }
  });
};

