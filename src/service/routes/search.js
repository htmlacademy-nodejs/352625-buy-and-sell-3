'use strict';

const {Router} = require(`express`);

const fs = require(`fs`);
const {promisify} = require(`util`);
const {FILE_NAME} = require(`./../cli/constants.js`);
const {Empty, PathName} = require(`./../routes/constants.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const searchRouter = new Router();

const readFile = promisify(fs.readFile);

searchRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.title.includes(req.query.query));

    if (result.length === 0 || req.query.query === Empty.DATA) {
      res.json(Empty.SEARCH);
      logger.debug(`Client request to url /${PathName.SEARCH}${req.url}`);
      logger.info(`End request with status code ${res.statusCode}`);

    } else {
      res.json(result);
      logger.debug(`Client request to url /${PathName.SEARCH}${req.url}`);
      logger.info(`End request with status code ${res.statusCode}`);
    }

  } catch (error) {
    res.json(Empty.SEARCH);
    logger.error(`No content, ${error}`);
  }
});

module.exports = searchRouter;
