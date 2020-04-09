'use strict';

const express = require(`express`);
const {Router} = require(`express`);

const fs = require(`fs`);
const {promisify} = require(`util`);
const {FILE_NAME} = require(`./../cli/constants.js`);
const {Empty} = require(`./../routes/constants.js`);

const offersRouter = new Router();

offersRouter.use(express.json());

const readFile = promisify(fs.readFile);

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
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent);

    if (!result) {
      res.status(400).json(Empty.OFFERS);
    } else {
      res.json(result);
    }

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

offersRouter.get(`/:id`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.id)[0];

    if (!result) {
      res.status(400).json(Empty.OFFER);
    } else {
      res.json(result);
    }

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

offersRouter.get(`/:id/comments`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const targetOffer = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.id)[0];

    if (!targetOffer) {
      res.status(400).json(Empty.COMMENTS);
    } else {
      const result = targetOffer.comments;
      res.json(result);
    }

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

offersRouter.post(`/`, async (req, res) => {
  try {
    if (!validateOffer()) {
      res.status(400).send(`Incorrect offer format`);
    } else {
      // some code for adding new offer is coming soon...
      res.send(req.body);
    }
  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

offersRouter.put(`/:id`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.id)[0];

    if (!result) {
      res.status(400).send(Empty.OFFER);
    } else {
      // some code for editing offer is coming soon...
      res.send(req.body);
    }

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

offersRouter.delete(`/:id`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.id)[0];

    if (!result) {
      res.status(400).send(`Invalid offer ID`);
    } else {
      // some code for deleting offer is coming soon...
      res.send(`Offer is deleted`);
    }

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

offersRouter.delete(`/:offerId/comments/:commentId`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const targetOffer = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.offerId)[0];

      // .comments
      // .filter((elem) => elem.id === req.params.commentId)[0];


    if (!targetOffer) {
      res.status(400).send(`Invalid offer ID`);

    } else {
      const targetComment = targetOffer.comments
        .filter((elem) => elem.id === req.params.commentId)[0];

      if(!targetComment) {
        res.status(400).send(`Invalid comment ID`);
      } else {
        // some code for deleting comment is coming soon...
        res.send(`Comment is deleted`);
      }
    }

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

offersRouter.put(`/:offerId/comments`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.offerId)[0];

    if (!validateComment() || !result) {
      res.status(400).send(Empty.COMMENT);
    } else {
      // some code for adding new comment is coming soon...
      res.send(req.body);
    }

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

module.exports = offersRouter;
