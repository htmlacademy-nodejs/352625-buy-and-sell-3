'use strict';

const Joi = require(`joi`);
const {NamePattern, ErrorMessages} = require(`./constants.js`);

module.exports = (existingEmail) => {
  return Joi.object({
    [`user-name`]: Joi.string()
      .regex(NamePattern)
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.pattern.base': ErrorMessages.STRING_PATTERN,
        'string.min': ErrorMessages.STRING_MIN,
        'string.max': ErrorMessages.STRING_MAX,
        'any.required': ErrorMessages.REQUIRED,
      }),

    [`user-email`]: Joi.string()
      .min(6)
      .max(100)
      .required()
      .invalid(existingEmail)
      .messages({
        'string.min': ErrorMessages.STRING_MIN,
        'string.max': ErrorMessages.STRING_MAX,
        'any.required': ErrorMessages.REQUIRED,
        'any.invalid': ErrorMessages.EMAIL_EXIST,
      }).email().messages({
        'string.email': ErrorMessages.INVALID_EMAIL,
      }),

    [`user-password`]: Joi.string()
      .min(6)
      .max(20)
      .required()
      .messages({
        'string.min': ErrorMessages.STRING_MIN,
        'string.max': ErrorMessages.STRING_MAX,
        'any.required': ErrorMessages.REQUIRED,
        'string.empty': ErrorMessages.EMPTY_STRING,
      }),

    [`user-password-again`]: Joi.string()
      .required()
      .valid(Joi.ref(`user-password`))
      .messages({
        'any.required': ErrorMessages.REQUIRED,
        'any.only': ErrorMessages.RETYPE_PASSWORDS,
      }),

    avatar: Joi.string()
      .empty(``),
  });
};
