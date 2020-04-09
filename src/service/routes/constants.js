'use strict';

const PathName = {
  OFFERS: `api/offers`,
  CATEGORIES: `api/categories`,
  SEARCH: `api/search`,
};

const Empty = {
  OFFERS: [],
  OFFER: {},
  COMMENTS: [],
  COMMENT: {},
  CATEGORIES: [],
  DATA: ``,
  SEARCH: `No search results`,
};

const SEARCH_PARAM = `?query=`;

module.exports = {
  PathName,
  Empty,
  SEARCH_PARAM,
};
