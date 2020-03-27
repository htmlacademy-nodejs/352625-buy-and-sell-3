'use strict';

const {Router} = require(`express`);

const fs = require(`fs`);
const {promisify} = require(`util`);
const {FILE_NAME} = require(`./../cli/constants.js`);
const {Empty} = require(`./../routes/constants.js`);

const offersRouter = new Router();

const readFile = promisify(fs.readFile);

offersRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent);
    res.json(result);

  } catch (error) {
    res.json(Empty.OFFERS);
    console.error(`No content, ${error}`);
  }
});

offersRouter.get(`/:id`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.id)[0] || Empty.OFFER;
    res.json(result);

  } catch (error) {
    res.json(Empty.OFFER);
    console.error(`No content, ${error}`);
  }
});

offersRouter.get(`/:id/comments`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.id)[0].comments || Empty.COMMENTS;
    res.json(result);

  } catch (error) {
    res.json(Empty.COMMENTS);
    console.error(`No content, ${error}`);
  }
});


module.exports = offersRouter;
