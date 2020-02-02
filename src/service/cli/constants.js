'use strict';

const CommandsNames = {
  VERSION: `--version`,
  GENERATE: `--generate`,
  HELP: `--help`
};

const DEFAULT_COMMAND = CommandsNames.HELP;
const USER_ARGV_INDEX = 2;
const ExitCode = {
  success: 0,
  failure: 1
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode,
  CommandsNames
};
