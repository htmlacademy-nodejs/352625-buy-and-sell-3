'use strict';

const {Router} = require(`express`);

const fs = require(`fs`);
const {promisify} = require(`util`);
const {FILE_NAME} = require(`./../cli/constants.js`);
const {Empty, PathName} = require(`./../routes/constants.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const categoriesRouter = new Router();

const readFile = promisify(fs.readFile);

categoriesRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = Array
      .from(new Set(JSON.parse(fileContent).map((elem) => elem.category[0] || Empty.DATA)));

    if (result === [Empty.DATA]) {
      res.json(Empty.CATEGORIES);
      logger.debug(`Client request to url /${PathName.CATEGORIES}${req.url}`);
      logger.info(`End request with status code ${res.statusCode}`);
    } else {
      res.json(result);
      logger.debug(`Client request to url /${PathName.CATEGORIES}${req.url}`);
      logger.info(`End request with status code ${res.statusCode}`);
    }

  } catch (error) {
    logger.error(`No content, ${error}`);
  }
});

module.exports = categoriesRouter;
