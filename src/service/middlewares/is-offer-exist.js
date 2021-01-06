'use strict';

const {HttpCode} = require(`./../constants.js`);
const {ErrorMessages} = require(`../schemas/constants.js`);

module.exports = (offerService) => (
  async (req, res, next) => {
    const offer = await offerService.findOne(req.body[`offerId`]);

    if (!offer) {
      res.status(HttpCode.NOT_FOUND).json({
        status: HttpCode.NOT_FOUND,
        data: req.body,
        errors: [{
          message: ErrorMessages.OFFER_NOT_FOUND,
        }],
      });
      return;
    }

    next();
  }
);
