'use strict';

const Tables = {
  AUTHORS: `authors`,
  TYPES: `types`,
  PICTURES: `pictures`,
  OFFERS: `offers`,
  CATEGORIES: `categories`,
  OFFERS_CATEGORIES: `offers_categories`,
  COMMENTS: `comments`,
};

const Comments = {
  MIN: 2,
  MAX: 6,
};

const Categories = {
  MIN: 1,
  MAX: 5,
};

const Pictures = {
  AVATAR: `avatar`,
  CATEGORY: `cat`,
  ITEM: `item`,
};

const PASSWORD_LENGTH = 8;

module.exports = {
  Tables,
  Comments,
  Categories,
  Pictures,
  PASSWORD_LENGTH,
};
