'use strict';

const PathName = {
  OFFERS: `api/offers`,
  CATEGORIES: `api/categories`,
  SEARCH: `api/search`,
  AUTH: `api/auth`,
};

const Empty = {
  OFFERS: [],
  OFFER: {},
  COMMENTS: [],
  COMMENT: {},
  CATEGORIES: [],
  DATA: ``,
  SEARCH: [],
};

const Items = {
  FRESH: 2,
  MOST_DISCUSSED: 2,
};

const SEARCH_PARAM = `?query=`;

const SEARCH_LIMIT = 10;

module.exports = {
  PathName,
  Empty,
  Items,
  SEARCH_PARAM,
  SEARCH_LIMIT,
};
