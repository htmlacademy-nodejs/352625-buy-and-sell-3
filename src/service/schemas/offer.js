'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string()
    .min(10)
    .max(100)
    .required()
    .messages({
      'string.min': `Длина должна быть не менее {#limit} символов`,
      'string.max': `Длина не должна превышать {#limit} символов`,
      'any.required': `Это обязательное поле`
    }),

  description: Joi.string()
    .min(50)
    .max(1000)
    .required()
    .messages({
      'string.min': `Длина должна быть не менее {#limit} символов`,
      'string.max': `Длина не должна превышать {#limit} символов`,
      'any.required': `Это обязательное поле`
    }),

  categories: Joi.array()
    .items(Joi.number().integer())
    .min(1)
    .required()
    .messages({
      'array.min': `Выберите хотя бы одну категорию`,
      'any.required': `Это обязательное поле`
    }),

  sum: Joi.number()
    .min(100)
    .required()
    .messages({
      'number.min': `Стоимость должна быть не менее {#limit}`,
      'any.required': `Это обязательное поле`
    }),

  type: Joi.string()
    .valid(`Куплю`, `Продам`)
    .required()
    .messages({
      'any.only': `Невалидное значение`,
      'any.required': `Это обязательное поле`
    }),


  [`offer_picture`]: Joi.string()
});
