'use strict';

const Joi = require(`joi`);

const {
  Title,
  Description,
  Sum,
  Categories,
  Type,
  ErrorMessages,
} = require(`./constants.js`);

module.exports = Joi.object({
  title: Joi.string()
    .min(Title.MIN)
    .max(Title.MAX)
    .required()
    .messages({
      'string.min': ErrorMessages.STRING_MIN,
      'string.max': ErrorMessages.STRING_MAX,
      'any.required': ErrorMessages.REQUIRED,
    }),

  description: Joi.string()
    .min(Description.MIN)
    .max(Description.MAX)
    .required()
    .messages({
      'string.min': ErrorMessages.STRING_MIN,
      'string.max': ErrorMessages.STRING_MAX,
      'any.required': ErrorMessages.REQUIRED,
    }),

  categories: Joi.array()
    .items(Joi.number().integer())
    .min(Categories.MIN)
    .required()
    .messages({
      'array.min': ErrorMessages.MIN_CATEGORIES,
      'any.required': ErrorMessages.REQUIRED,
    }),

  sum: Joi.number()
    .min(Sum.MIN)
    .required()
    .messages({
      'number.min': ErrorMessages.NUMBER_MIN,
      'any.required': ErrorMessages.REQUIRED,
    }),

  type: Joi.string()
    .valid(Type.BUY, Type.SELL)
    .required()
    .messages({
      'any.only': ErrorMessages.ONLY,
      'any.required': ErrorMessages.REQUIRED,
    }),


  [`offer_picture`]: Joi.string()
});
