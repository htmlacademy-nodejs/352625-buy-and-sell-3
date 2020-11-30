'use strict';

const types = [
  {name: `Куплю`},
  {name: `Продам`}
];

const pictures = [
  {type: `item`, normal: `item01.jpg`, double: `item01@2x.jpg`},
  {type: `item`, normal: `item02.jpg`, double: `item02@2x.jpg`},
  {type: `item`, normal: `item03.jpg`, double: `item03@2x.jpg`},
  {type: `item`, normal: `item04.jpg`, double: `item04@2x.jpg`},
  {type: `item`, normal: `item05.jpg`, double: `item05@2x.jpg`},
  {type: `category`, normal: `cat01.jpg`, double: `cat01@2x.jpg`},
  {type: `category`, normal: `cat02.jpg`, double: `cat02@2x.jpg`},
  {type: `category`, normal: `cat03.jpg`, double: `cat03@2x.jpg`},
  {type: `category`, normal: `cat04.jpg`, double: `cat04@2x.jpg`},
  {type: `category`, normal: `cat05.jpg`, double: `cat05@2x.jpg`},
  {type: `avatar`, normal: `avatar01.jpg`, double: `avatar01@2x.jpg`},
  {type: `avatar`, normal: `avatar02.jpg`, double: `avatar02@2x.jpg`},
  {type: `avatar`, normal: `avatar03.jpg`, double: `avatar03@2x.jpg`},
  {type: `avatar`, normal: `avatar04.jpg`, double: `avatar04@2x.jpg`},
];

const authors = [
  {
    firstname: `Иван`,
    lastname: `Подлесный`,
    email: `podlesniy_i@local.com`,
    password: `qwerty123`,
    [`picture_id`]: 11,
  },
  {
    firstname: `Михаил`,
    lastname: `Абрамов`,
    email: `abramov_m@local.com`,
    password: `ytrewq111`,
    [`picture_id`]: 12,
  },
  {
    firstname: `Антон`,
    lastname: `Маркин`,
    email: `anton_markin@local.com`,
    password: `asdfgh456`,
    [`picture_id`]: 13,
  },
  {
    firstname: `Анастасия`,
    lastname: `Зинченко`,
    email: `zinchenko_a@local.com`,
    password: `zxcvbn098`,
    [`picture_id`]: 14,
  },
];

const auths = [
  {[`author_id`]: 1, [`is_auth`]: false},
  {[`author_id`]: 2, [`is_auth`]: false},
  {[`author_id`]: 3, [`is_auth`]: false},
  {[`author_id`]: 4, [`is_auth`]: false},
];

const categories = [
  {name: `Книги`, [`picture_id`]: 6},
  {name: `Разное`, [`picture_id`]: 7},
  {name: `Посуда`, [`picture_id`]: 8},
  {name: `Игры`, [`picture_id`]: 9},
  {name: `Животные`, [`picture_id`]: 10},
];

const offers = [
  {
    title: `поддержанный портфель`,
    description: `Даю недельную гарантию. Если товар не понравится — верну всё до последней копейки. Это настоящая находка для коллекционера!`,
    [`created_date`]: `2019-02-03`,
    sum: 5234,
    [`author_id`]: 1,
    [`picture_id`]: 1,
    [`type_id`]: 1,
  },
  {
    title: `наручные часы`,
    description: `Если найдёте дешевле — сброшу цену. Таких предложений больше нет!`,
    [`created_date`]: `2019-04-05`,
    sum: 8340,
    [`author_id`]: 2,
    [`picture_id`]: 2,
    [`type_id`]: 2,
  },
  {
    title: `антиквариат`,
    description: `Пользовались бережно и только по большим праздникам. Даю недельную гарантию.`,
    [`created_date`]: `2020-04-12`,
    sum: 24600,
    [`author_id`]: 3,
    [`picture_id`]: 3,
    [`type_id`]: 1,
  },
  {
    title: `Уникальное предложение!`,
    description: `Товар в отличном состоянии. Пользовались бережно и только по большим праздникам. Продаю с болью в сердце...`,
    [`created_date`]: `2019-01-01`,
    sum: 2000,
    [`author_id`]: 4,
    [`picture_id`]: 4,
    [`type_id`]: 2,
  },
];

const offersCategories = [
  {
    [`offer_id`]: 1,
    [`category_id`]: 1,
  },
  {
    [`offer_id`]: 1,
    [`category_id`]: 2,
  },
  {
    [`offer_id`]: 1,
    [`category_id`]: 5,
  },
  {
    [`offer_id`]: 2,
    [`category_id`]: 1,
  },
  {
    [`offer_id`]: 2,
    [`category_id`]: 2,
  },
  {
    [`offer_id`]: 2,
    [`category_id`]: 3,
  },
  {
    [`offer_id`]: 3,
    [`category_id`]: 2,
  },
  {
    [`offer_id`]: 3,
    [`category_id`]: 3,
  },
  {
    [`offer_id`]: 3,
    [`category_id`]: 4,
  },
  {
    [`offer_id`]: 3,
    [`category_id`]: 5,
  },
  {
    [`offer_id`]: 4,
    [`category_id`]: 2,
  },
];

const comments = [
  {
    text: `Оплата наличными или перевод на карту?`,
    [`created_date`]: `2019-01-01`,
    [`author_id`]: 1,
    [`offer_id`]: 1,
  },
  {
    text: `С чем связана продажа?`,
    [`created_date`]: `2019-01-01`,
    [`author_id`]: 2,
    [`offer_id`]: 1,
  },
  {
    text: `Неплохо, но дорого.`,
    [`created_date`]: `2019-01-01`,
    [`author_id`]: 2,
    [`offer_id`]: 1,
  },
  {
    text: `Почему так дешёво?`,
    [`created_date`]: `2019-01-01`,
    [`author_id`]: 1,
    [`offer_id`]: 2,
  },
  {
    text: `Почему в таком ужасном состоянии?`,
    [`created_date`]: `2019-01-01`,
    [`author_id`]: 2,
    [`offer_id`]: 2,
  },
  {
    text: `Вы что?!`,
    [`created_date`]: `2019-01-01`,
    [`author_id`]: 3,
    [`offer_id`]: 2,
  },
  {
    text: `В магазине дешевле.`,
    [`created_date`]: `2019-01-01`,
    [`author_id`]: 4,
    [`offer_id`]: 3,
  },
  {
    text: `А сколько игр в комплекте?`,
    [`created_date`]: `2019-01-01`,
    [`author_id`]: 4,
    [`offer_id`]: 4,
  },
];

const mocks = {
  types,
  pictures,
  authors,
  auths,
  categories,
  offers,
  offersCategories,
  comments,
};

module.exports = mocks;
