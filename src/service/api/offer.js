'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty, PathName} = require(`../routes/constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();


module.exports = (app, offerService, commentService) => {
  const route = new Router();

  app.use(`${PathName.OFFERS}`, route);

  route.get(`/`, async (req, res) => {
    try {
      const result = await offerService.findAll();
      res.status(HttpCode.OK).json(result);
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.OFFERS);
      logger.error(`Error occurs: ${error}`);
    }
  });


  route.get(`/fresh`, async (req, res) => {
    try {
      const result = await offerService.findFresh();
      res.status(HttpCode.OK).json(result);
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.OFFERS);
      logger.error(`Error occurs: ${error}`);
    }
  });


  route.get(`/mostDiscussed`, async (req, res) => {
    try {
      const result = await offerService.findMostDiscussed();
      res.status(HttpCode.OK).json(result);
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.OFFERS);
      logger.error(`Error occurs: ${error}`);
    }
  });


  route.get(`/:offerId`, async (req, res) => {
    try {
      let data = null;
      const offerId = parseInt(req.params.offerId, 10);

      if (offerId) {
        data = await offerService.findOne(offerId);
      }

      if (data) {
        res.status(HttpCode.OK).json(data);

      } else {
        res.status(HttpCode.BAD_REQUEST).json(Empty.OFFER);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.OFFER);
      logger.error(`Error occurs: ${error}`);
    }
  });


  route.get(`/:offerId/comments`, async (req, res) => {
    try {
      let data = null;
      const offerId = parseInt(req.params.offerId, 10);

      if (offerId) {
        data = await commentService.findAllByOfferId(offerId);
      }

      if (data) {
        res.status(HttpCode.OK).json(data);
      } else {
        res.status(HttpCode.BAD_REQUEST).json(Empty.COMMENTS);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.COMMENTS);
      logger.error(`Error occurs: ${error}`);
    }
  });


  route.get(`/byAuthorId/:authorId`, async (req, res) => {
    try {
      let data = null;
      const authorId = parseInt(req.params.authorId, 10);

      if (authorId) {
        data = await offerService.findAllByAuthorId(authorId);
      }

      if (data) {
        res.status(HttpCode.OK).json(data);
      } else {
        res.status(HttpCode.BAD_REQUEST).json(Empty.OFFERS);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.OFFER);
      logger.error(`Error occurs: ${error}`);
    }
  });
};

