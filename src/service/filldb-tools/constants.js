'use strict';

const OffersList = {
  OFFER: `offer`,
  SALE: `sale`,
};

const OfferType = {
  [OffersList.OFFER]: `Куплю`,
  [OffersList.SALE]: `Продам`,
};

const Pictures = {
  AVATAR: `avatar`,
  CATEGORY: `cat`,
  ITEM: `item`,
  FIRST_ID: 1,
};

const Categories = {
  MIN: 1,
  MAX: 5,
};

const Comments = {
  MIN: 2,
  MAX: 6,
};

const Time = {
  MIN: -(1000 * 60 * 60 * 24 * 30 * 3), // 3 months in milliseconds
  MAX: 0,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const DEFAULT_MOCK_PASSWORD = `qwerty1234`;

module.exports = {
  OfferType,
  Pictures,
  Categories,
  Comments,
  Time,
  SumRestrict,
  DEFAULT_MOCK_PASSWORD,
};
