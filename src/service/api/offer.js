'use strict';

const {Router} = require(`express`);
const {HttpCode, PathName, Empty} = require(`../constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const validateOffer = () => {
  // TODO: validating code is coming soon...
  return true;
};

const validateComment = () => {
  // TODO: validating code is coming soon...
  return true;
};


module.exports = (app, offerService, commentService, authService) => {
  const route = new Router();

  app.use(`/${PathName.OFFERS}`, route);

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


  route.post(`/`, async (req, res) => {
    try {
      const auth = await authService.get();

      if (!validateOffer() || !auth.status) {
        res.status(HttpCode.BAD_REQUEST).send(`Incorrect article format or unauthorized access`);
      } else {
        await offerService.add(req.body, auth.user.id);
        res.status(HttpCode.OK).send(req.body);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
      logger.error(`Error occurs: ${error}`);
    }
  });


  route.put(`/:offerId`, async (req, res) => {
    try {
      let data = null;
      const offerId = parseInt(req.params.offerId, 10);

      if (offerId) {
        data = await offerService.findOne(offerId);
      }

      if (data) {
        await offerService.update(req.body, offerId);
        res.status(HttpCode.OK).send(req.body);

      } else {
        res.status(HttpCode.BAD_REQUEST).send(Empty.OFFER);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
      logger.error(`Error occurs: ${error}`);
    }

  });


  route.delete(`/:offerId`, async (req, res) => {
    try {
      let data = null;
      const offerId = parseInt(req.params.offerId, 10);

      if (offerId) {
        data = await offerService.findOne(offerId);
      }

      if (data) {
        await offerService.delete(offerId);
        res.status(HttpCode.OK).send(`Offer is deleted`);

      } else {
        res.status(HttpCode.BAD_REQUEST).send(Empty.OFFER);
      }

      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
      logger.error(`Error occurs: ${error}`);
    }
  });


  route.post(`/:offerId/comments`, async (req, res) => {
    try {
      const offerId = parseInt(req.params.offerId, 10);
      const auth = await authService.get();

      if (validateComment() && auth.status && Number.isInteger(offerId)) {
        await commentService.add(req.body, offerId, auth.user.id);
        res.status(HttpCode.OK).send(req.body);

      } else {
        res.status(HttpCode.BAD_REQUEST).send(Empty.COMMENT);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
      logger.error(`Error occurs: ${error}`);
    }
  });
};

