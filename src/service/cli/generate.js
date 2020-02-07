'use strict';

const fs = require(`fs`);
const chalk = require(`chalk`);
const {promisify} = require(`util`);

const {
  DEFAULT_COUNT,
  MAX_COUNT,
  FILE_NAME,
  CommandsNames,
  ExitCode
} = require(`./constants.js`);

const {generateOffers, makeList} = require(`./../utils.js`);

const writeOffers = async (path, data) => {
  const writeFile = promisify(fs.writeFile);

  try {
    await writeFile(path, data);
    console.info(chalk.green(`Operation success. File created.`));

  } catch (error) {
    console.error(chalk.red(`Can't write data to file...`));
    process.exit(ExitCode.FAILURE);
  }
};

const getFileData = async (path) => {
  const readFile = promisify(fs.readFile);

  try {
    return makeList(await readFile(path, `utf8`));

  } catch (error) {
    console.error(`Can't read data from file... ${error}`);
    return process.exit(ExitCode.FAILURE);
  }
};

module.exports = {
  name: CommandsNames.GENERATE,
  run(args) {
    const [count] = args;
    const countOffer = Math.abs(Number.parseInt(count, 10)) || DEFAULT_COUNT;

    if (countOffer >= MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} объявлений`));
      process.exit(ExitCode.FAILURE);
    }

    Promise
      .all([
        getFileData(`./src/data/sentences.txt`),
        getFileData(`./src/data/categories.txt`),
        getFileData(`./src/data/titles.txt`),
      ])
      .then((result) => {
        const sentences = result[0];
        const categories = result[1];
        const titles = result[2];
        return JSON.stringify(generateOffers(countOffer, sentences, categories, titles));
      })
      .then((content) => writeOffers(FILE_NAME, content));
  }
};
