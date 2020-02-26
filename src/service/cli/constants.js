'use strict';

const DEFAULT_COUNT = 1;

const MAX_COUNT = 1000;

const FILE_NAME = `mocks.json`;

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const Picture = {
  NAME: `item`,
  DIMENSION: `jpg`,
  Restrict: {
    MIN: 1,
    MAX: 16,
    BORDER: 10
  },
};

const CommandsNames = {
  VERSION: `--version`,
  GENERATE: `--generate`,
  HELP: `--help`,
  SERVER: `--server`,
};

const DEFAULT_COMMAND = CommandsNames.HELP;

const USER_ARGV_INDEX = 2;

const ExitCode = {
  SUCCESS: 0,
  FAILURE: 1
};

const FILE_SENTENCES_PATH = `./src/data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./src/data/categories.txt`;
const FILE_TITLES_PATH = `./src/data/titles.txt`;

const DEFAULT_PORT = 8080;

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

module.exports = {
  DEFAULT_COUNT,
  MAX_COUNT,
  FILE_NAME,
  OfferType,
  SumRestrict,
  Picture,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode,
  CommandsNames,
  FILE_SENTENCES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_TITLES_PATH,
  DEFAULT_PORT,
  HttpCode
};