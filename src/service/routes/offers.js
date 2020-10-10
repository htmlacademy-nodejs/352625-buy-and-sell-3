'use strict';

const express = require(`express`);
const {Router} = require(`express`);

const {Empty, PathName} = require(`./../routes/constants.js`);
const {HttpCode} = require(`./../cli/constants.js`);
const {getOffers, getFreshItems, getMostDiscussed} = require(`./utils/offers.js`);
const {getOffer} = require(`./utils/offer.js`);
const {getCommentsByOfferId} = require(`./utils/comments.js`);

const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const offersRouter = new Router();

offersRouter.use(express.json());

const validateOffer = () => {
  // TODO validating code is coming soon...
  return true;
};

const validateComment = () => {
  // TODO validating code is coming soon...
  return true;
};

offersRouter.get(`/`, async (req, res) => {
  try {
    const result = await getOffers();
    res.json(result);
    logger.debug(`${req.method} /${PathName.OFFERS}${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.OFFERS);
    logger.error(`Error occurs: ${error}`);
  }
});

offersRouter.get(`/fresh`, async (req, res) => {
  try {
    const result = await getFreshItems();
    res.json(result);
    logger.debug(`${req.method} /${PathName.OFFERS}${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.OFFERS);
    logger.error(`Error occurs: ${error}`);

  }
});

offersRouter.get(`/mostDiscussed`, async (req, res) => {
  try {
    const result = await getMostDiscussed();
    res.json(result);
    logger.debug(`${req.method} /${PathName.OFFERS}${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.OFFERS);
    logger.error(`Error occurs: ${error}`);

  }
});

offersRouter.get(`/:offerId`, async (req, res) => {
  try {
    let data = null;
    const offerId = parseInt(req.params.offerId, 10);

    if (offerId) {
      data = await getOffer(offerId);
    }

    if (data) {
      res.json(data);

    } else {
      res.status(HttpCode.BAD_REQUEST).json(Empty.OFFER);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.OFFER);
    logger.error(`Error occurs: ${error}`);
  }
  logger.debug(`${req.method} /${PathName.OFFERS}${req.url} --> res status code ${res.statusCode}`);
});

offersRouter.get(`/:offerId/comments`, async (req, res) => {
  try {
    let data = null;
    const offerId = parseInt(req.params.offerId, 10);

    if (offerId) {
      data = await getCommentsByOfferId(offerId);
    }

    if (data) {
      res.json(data);
    } else {
      res.status(HttpCode.BAD_REQUEST).json(Empty.COMMENTS);
    }

    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(500).json(Empty.COMMENTS);
    logger.error(`Error occurs: ${error}`);
  }
  logger.debug(`${req.method} /${PathName.OFFERS}${req.url} --> res status code ${res.statusCode}`);
});

offersRouter.post(`/`, (req, res) => {
  try {
    if (!validateOffer()) {
      res.status(400).send(`Incorrect offer format`);
    } else {
      // some code for adding new offer is coming soon...
      res.send(req.body);

      // TEMP observe receiving FormData of newTicket:
      logger.info(req.body);
    }
    logger.debug(`${req.method} /${PathName.OFFERS}${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
});

offersRouter.put(`/:id`, async (req, res) => {
  try {
    const data = [];

    if (!data) {
      res.status(400).send(Empty.OFFER);
    } else {
      // some code for editing offer is coming soon...
      res.send(req.body);
    }
    logger.debug(`${req.method} /${PathName.OFFERS}${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
});

offersRouter.delete(`/:id`, async (req, res) => {
  try {
    const data = [];

    if (!data) {
      res.status(400).send(`Invalid offer ID`);
    } else {
      // some code for deleting offer is coming soon...
      res.send(`Offer is deleted`);
    }
    logger.debug(`${req.method} /${PathName.OFFERS}${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
});

offersRouter.put(`/:offerId/comments`, async (req, res) => {
  try {
    const data = [];

    if (!validateComment() || !data) {
      res.status(400).send(Empty.COMMENT);
    } else {
      // some code for adding new comment is coming soon...
      res.send(req.body);
    }
    logger.debug(`${req.method} /${PathName.OFFERS}${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = offersRouter;
