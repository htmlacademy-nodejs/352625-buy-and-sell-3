'use strict';

const express = require(`express`);
const {Router} = require(`express`);

const {Empty, PathName} = require(`./../routes/constants.js`);
const getMock = require(`./../mocks-data.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const offersRouter = new Router();

offersRouter.use(express.json());

const validateOffer = () => {
  // validating code is coming soon...
  return true;
};

const validateComment = () => {
  // validating code is coming soon...
  return true;
};

offersRouter.get(`/`, async (req, res) => {
  try {
    const result = await getMock();
    res.json(result);

  } catch (error) {
    res.status(500).json(Empty.OFFERS);
    logger.error(`Error occurs: ${error}`);
  }
  logger.debug(`${req.method} /${PathName.OFFERS}${req.url} --> res status code ${res.statusCode}`);
});

offersRouter.get(`/:id`, async (req, res) => {
  try {
    const data = await getMock();
    const result = data
      .filter((elem) => elem.id === req.params.id)[0];

    if (!result) {
      res.status(404).json(Empty.OFFER);
    } else {
      res.json(result);
    }

  } catch (error) {
    res.status(500).json(Empty.OFFER);
    logger.error(`Error occurs: ${error}`);
  }
  logger.debug(`${req.method} /${PathName.OFFERS}${req.url} --> res status code ${res.statusCode}`);
});

offersRouter.get(`/:id/comments`, async (req, res) => {
  try {
    const data = await getMock();
    const targetOffer = data
      .filter((elem) => elem.id === req.params.id)[0];

    if (!targetOffer) {
      res.status(404).json(Empty.COMMENTS);
    } else {
      const result = targetOffer.comments;
      res.json(result);
    }

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
    const data = await getMock();
    const result = data
      .filter((elem) => elem.id === req.params.id)[0];

    if (!result) {
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
    const data = await getMock();
    const result = data
      .filter((elem) => elem.id === req.params.id)[0];

    if (!result) {
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

offersRouter.delete(`/:offerId/comments/:commentId`, async (req, res) => {
  try {
    const data = await getMock();
    const targetOffer = data
      .filter((elem) => elem.id === req.params.offerId)[0];

    if (!targetOffer) {
      res.status(400).send(`Invalid offer ID`);
    } else {
      const targetComment = targetOffer.comments
        .filter((elem) => elem.id === req.params.commentId)[0];

      if (!targetComment) {
        res.status(400).send(`Invalid comment ID`);
      } else {
        // some code for deleting comment is coming soon...
        res.send(`Comment is deleted`);
      }
    }
    logger.debug(`${req.method} /${PathName.OFFERS}${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
});

offersRouter.put(`/:offerId/comments`, async (req, res) => {
  try {
    const data = await getMock();
    const result = data
      .filter((elem) => elem.id === req.params.offerId)[0];

    if (!validateComment() || !result) {
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
