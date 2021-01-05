'use strict';

const {HttpCode} = require(`../constants.js`);
const {getLogger} = require(`./../../service/logger.js`);
const {ErrorMessages} = require(`../schemas/constants.js`);

const logger = getLogger();

module.exports = (service, param1 = null, param2 = null) => (
  async (req, res, next) => {
    res.body = await service(req.params[`${param1}`], req.params[`${param2}`]);

    if (!res.body) {
      res.status(HttpCode.NOT_FOUND).json({
        status: HttpCode.NOT_FOUND,
        data: req.body,
        errors: [{
          message: ErrorMessages.DATA_NOT_FOUND,
        }],
      });
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      return;
    }

    next();
  }
);
