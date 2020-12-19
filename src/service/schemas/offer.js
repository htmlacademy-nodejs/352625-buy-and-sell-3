'use strict';

const Joi = require(`joi`);

const Title = {
  MIN: 10,
  MAX: 100,
};

const Description = {
  MIN: 50,
  MAX: 1000,
};

const Categories = {
  MIN: 1,
};

const Sum = {
  MIN: 100,
};

const Type = {
  BUY: `Куплю`,
  SELL: `Продам`,
};

module.exports = Joi.object({
  title: Joi.string()
    .min(Title.MIN)
    .max(Title.MAX)
    .required()
    .messages({
      'string.min': `Длина должна быть не менее {#limit} символов`,
      'string.max': `Длина не должна превышать {#limit} символов`,
      'any.required': `Это обязательное поле`
    }),

  description: Joi.string()
    .min(Description.MIN)
    .max(Description.MAX)
    .required()
    .messages({
      'string.min': `Длина должна быть не менее {#limit} символов`,
      'string.max': `Длина не должна превышать {#limit} символов`,
      'any.required': `Это обязательное поле`
    }),

  categories: Joi.array()
    .items(Joi.number().integer())
    .min(Categories.MIN)
    .required()
    .messages({
      'array.min': `Выберите хотя бы одну категорию`,
      'any.required': `Это обязательное поле`
    }),

  sum: Joi.number()
    .min(Sum.MIN)
    .required()
    .messages({
      'number.min': `Стоимость должна быть не менее {#limit}`,
      'any.required': `Это обязательное поле`
    }),

  type: Joi.string()
    .valid(Type.BUY, Type.SELL)
    .required()
    .messages({
      'any.only': `Невалидное значение`,
      'any.required': `Это обязательное поле`
    }),


  [`offer_picture`]: Joi.string()
});
