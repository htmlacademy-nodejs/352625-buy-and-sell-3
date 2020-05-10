'use strict';

const chalk = require(`chalk`);

const {
  DEFAULT_COUNT,
  MAX_COUNT,
  FILE_NAME,
  CommandsNames,
  ExitCode,
  FILE_SENTENCES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_TITLES_PATH,
  FILE_COMMENTS_PATH,
  FILE_USERS_PATH,
} = require(`./constants.js`);

const {
  generateOffers,
  getFileData,
  writeOffers
} = require(`./../utils.js`);

const generateContent = async (countOffer) => {
  const [sentences, categories, titles, comments, users] = await Promise.all([
    getFileData(FILE_SENTENCES_PATH),
    getFileData(FILE_CATEGORIES_PATH),
    getFileData(FILE_TITLES_PATH),
    getFileData(FILE_COMMENTS_PATH),
    getFileData(FILE_USERS_PATH),
  ]);

  const content = JSON
    .stringify(generateOffers(countOffer, sentences, categories, titles, comments, users));

  writeOffers(FILE_NAME, content);
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

    generateContent(countOffer);
  }
};
