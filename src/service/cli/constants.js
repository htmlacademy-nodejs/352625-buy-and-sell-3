'use strict';

const CommandsNames = {
  VERSION: `--version`,
  HELP: `--help`,
  SERVER: `--server`,
  DB_CONNECT: `--db-connect`,
};

const DEFAULT_COMMAND = CommandsNames.HELP;

const USER_ARGV_INDEX = 2;

const ExitCode = {
  SUCCESS: 0,
  FAILURE: 1
};

const DEFAULT_API_PORT = 3000;
const URL_API = `http://localhost:${DEFAULT_API_PORT}`;

const HttpCode = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode,
  CommandsNames,
  DEFAULT_API_PORT,
  URL_API,
  HttpCode,
};
