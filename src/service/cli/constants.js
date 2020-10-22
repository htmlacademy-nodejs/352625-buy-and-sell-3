'use strict';

const CommandsNames = {
  VERSION: `--version`,
  HELP: `--help`,
  SERVER: `--server`,
  DB_CONNECT: `--db-connect`,
  FILL_DB: `--filldb`,
};

const DEFAULT_COMMAND = CommandsNames.HELP;

const USER_ARGV_INDEX = 2;

const ExitCode = {
  SUCCESS: 0,
  FAILURE: 1
};

const DEFAULT_API_PORT = 3000;
const URL_API = `http://localhost:${DEFAULT_API_PORT}`;

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode,
  CommandsNames,
  DEFAULT_API_PORT,
  URL_API,
};
