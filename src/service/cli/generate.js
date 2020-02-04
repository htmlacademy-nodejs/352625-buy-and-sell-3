'use strict';

const fs = require(`fs`);
const chalk = require(`chalk`);
const {promisify} = require(`util`);

const {
  CommandsNames,
  ExitCode
} = require(`./constants.js`);

const {generateOffers} = require(`./../utils.js`);

const {
  DEFAULT_COUNT,
  MAX_COUNT,
  FILE_NAME
} = require(`./mocksData.js`);

const writeOffers = async (path, data) => {
  const writeFile = promisify(fs.writeFile);

  try {
    await writeFile(path, data);
    console.info(chalk.green(`Operation success. File created.`));

  } catch (error) {
    console.error(chalk.red(`Can't write data to file...`));
    process.exit(ExitCode.failure);
  }
};

module.exports = {
  name: CommandsNames.GENERATE,
  run(args) {
    const [count] = args;
    const countOffer = Math.abs(Number.parseInt(count, 10)) || DEFAULT_COUNT;

    if (countOffer >= MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} объявлений`));
      process.exit(ExitCode.failure);
    }

    const content = JSON.stringify(generateOffers(countOffer));

    writeOffers(FILE_NAME, content);

  }
};
