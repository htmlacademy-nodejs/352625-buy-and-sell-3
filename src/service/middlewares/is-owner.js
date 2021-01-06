'use strict';

const {HttpCode} = require(`./../constants.js`);
const {ErrorMessages} = require(`../schemas/constants.js`);

module.exports = (service, param) => (
  async (req, res, next) => {
    const match = await service.checkAuthorship(req.body[`${param}`], req.body[`userId`]);

    if (!match) {
      res.status(HttpCode.FORBIDDEN).json({
        status: HttpCode.FORBIDDEN,
        data: req.body,
        errors: [{
          message: ErrorMessages.UNAUTHORIZED,
        }],
      });
      return;
    }

    next();
  }
);
