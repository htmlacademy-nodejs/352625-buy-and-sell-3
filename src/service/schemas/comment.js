'use strict';

const Joi = require(`joi`);

const {Text, ErrorMessages} = require(`./constants.js`);

module.exports = Joi.object({
  text: Joi.string()
    .min(Text.MIN)
    .max(Text.MAX)
    .required()
    .empty(``)
    .messages({
      'string.min': ErrorMessages.STRING_MIN,
      'string.max': ErrorMessages.STRING_MAX,
      'any.required': ErrorMessages.REQUIRED,
    }),

  userId: Joi.number()
    .integer()
    .required()
    .messages({
      'any.required': ErrorMessages.REQUIRED,
    }),

  offerId: Joi.number()
    .integer()
    .required()
    .messages({
      'any.required': ErrorMessages.REQUIRED,
    }),


});
