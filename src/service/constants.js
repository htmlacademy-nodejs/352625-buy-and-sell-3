'use strict';

const HttpCode = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

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
  CATEGORY: {},
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
  HttpCode,
  PathName,
  Empty,
  Items,
  SEARCH_PARAM,
  SEARCH_LIMIT,
};
