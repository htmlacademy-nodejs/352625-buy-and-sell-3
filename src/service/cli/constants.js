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
  HELP: `--help`
};

const DEFAULT_COMMAND = CommandsNames.HELP;

const USER_ARGV_INDEX = 2;

const ExitCode = {
  SUCCESS: 0,
  FAILURE: 1
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
  CommandsNames
};
