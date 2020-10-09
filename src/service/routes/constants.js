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

const SEARCH_PARAM = `?query=`;

module.exports = {
  PathName,
  Empty,
  SEARCH_PARAM,
};
