'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {PathName} = require(`../routes/constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();


module.exports = (app, authService) => {
  const route = new Router();

  app.use(`${PathName.AUTH}`, route);

  route.get(`/`, async (req, res) => {
    try {
      const data = await authService.get();

      res.status(HttpCode.OK).json(data);
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
      logger.error(`Error occurs: ${error}`);
    }
  });
};
