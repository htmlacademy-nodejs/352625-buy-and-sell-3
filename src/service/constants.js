'use strict';

const HttpCode = {
  OK: 200,
  CREATED: 201,
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
  COMMENTS: `api/comments`,
  USER: `api/user`,
};

const Empty = {
  AUTH: {status: false, user: null},
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
  FRESH: 8,
  MOST_DISCUSSED: 8,
};

const Pagination = {
  SIZE: 8,
  DEFAULT_PAGE: 1,
};

const SEARCH_PARAM = `?query=`;

const SEARCH_LIMIT = 10;

module.exports = {
  HttpCode,
  PathName,
  Empty,
  Items,
  Pagination,
  SEARCH_PARAM,
  SEARCH_LIMIT,
};
