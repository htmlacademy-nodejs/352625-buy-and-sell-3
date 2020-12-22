'use strict';

const Text = {
  MIN: 20,
  MAX: 150,
};

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

const NamePattern = /([а-яА-яa-zA-z]+\s)+([а-яА-яa-zA-z]+)/;

const ErrorMessages = {
  REQUIRED: `Это обязательное поле`,
  STRING_MIN: `Длина должна быть не менее {#limit} символов`,
  STRING_MAX: `Длина не должна превышать {#limit} символов`,
  NUMBER_MIN: `Стоимость должна быть не менее {#limit}`,
  MIN_CATEGORIES: `Выберите хотя бы одну категорию`,
  ONLY: `Невалидное значение`,
  INVALID_EMAIL: `Невалидный email`,
  EMAIL_EXIST: `Этот email занят`,
  RETYPE_PASSWORDS: `Пароли не совпали - повторите еще раз`,
  EMPTY_STRING: `Пустая строка`,
  STRING_PATTERN: `Введите имя и фамилию через пробел`,
};

module.exports = {
  Text,
  Title,
  Description,
  Sum,
  Categories,
  Type,
  NamePattern,
  ErrorMessages,
};
