'use strict';

const Joi = require(`joi`);

const Text = {
  MIN: 20,
  MAX: 150,
};

module.exports = Joi.object({
  text: Joi.string()
    .min(Text.MIN)
    .max(Text.MAX)
    .required()
    .empty(``)
    .messages({
      'string.min': `Длина должна быть не менее {#limit} символов`,
      'string.max': `Длина не должна превышать {#limit} символов`,
      'any.required': `Комментарий не может быть пустым`,
    }),
});
