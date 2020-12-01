'use strict';

const {HttpCode} = require(`../constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const makeCategoriesValid = (offer) => {
  if (!offer.categories) {
    offer.categories = [];
  }
  if (offer.categories && offer.categories.length === 1) {
    offer.categories = [parseInt(offer.categories, 10)];
  }
  if (offer.categories && offer.categories.length > 1) {
    offer.categories = offer.categories.map((item) => parseInt(item, 10));
  }
  return offer;
};

module.exports = (schema) => (
  async (req, res, next) => {
    const {body} = req;
    const data = makeCategoriesValid(body);

    try {
      await schema.validateAsync(data, {
        abortEarly: false
      });
    } catch (err) {
      const {details} = err;

      res.status(HttpCode.BAD_REQUEST).json({
        status: HttpCode.BAD_REQUEST,
        data,
        errors: details.map((errorDescription) => ({
          label: errorDescription.context.label,
          message: errorDescription.message,
        })),
      });

      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      return;
    }

    next();
  }
);
