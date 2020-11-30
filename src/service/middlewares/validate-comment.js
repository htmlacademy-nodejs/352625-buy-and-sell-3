'use strict';

const {HttpCode} = require(`../constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const validateComment = () => {
  // TODO: validating code is coming soon...
  return true;
};

module.exports = () => (
  async (req, res, next) => {

    if (!validateComment()) {
      res.status(HttpCode.BAD_REQUEST).json(`Incorrect comment format`);
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      return;
    }

    next();
  }
);
