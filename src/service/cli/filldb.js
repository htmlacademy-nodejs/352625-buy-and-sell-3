'use strict';

const chalk = require(`chalk`);

const {sequelize, initDb} = require(`./../../data/db`);

const DEFAULT_COUNT = 10;
const MAX_COUNT = 100;

const FILE_USERS_PATH = `./src/data/initial/users.txt`;
const FILE_CATEGORIES_PATH = `./src/data/initial/categories.txt`;
const FILE_SENTENCES_PATH = `./src/data/initial/sentences.txt`;
const FILE_TITLES_PATH = `./src/data/initial/titles.txt`;
const FILE_COMMENTS_PATH = `./src/data/initial/comments.txt`;

const {
  CommandsNames,
  ExitCode,
} = require(`./constants.js`);

const {
  AUTH_USER_ID
} = require(`../filldb-tools/constants.js`);

const {
  getFileData,
} = require(`../filldb-tools/utils.js`);

const getContent = require(`../filldb-tools`);

const generateContent = async (count, authUserId) => {
  const [
    users,
    categories,
    sentences,
    titles,
    comments,
  ] = await Promise.all([
    getFileData(FILE_USERS_PATH),
    getFileData(FILE_CATEGORIES_PATH),
    getFileData(FILE_SENTENCES_PATH),
    getFileData(FILE_TITLES_PATH),
    getFileData(FILE_COMMENTS_PATH),
  ]);

  return getContent(
      count,
      authUserId,
      categories,
      users,
      sentences,
      titles,
      comments
  );
};

module.exports = {
  name: CommandsNames.FILL_DB,
  run(args) {
    const [count] = args;
    const postsCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (postsCount >= MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} публикаций`));
      process.exit(ExitCode.FAILURE);
    }

    (async () => {
      const content = await generateContent(postsCount, AUTH_USER_ID);
      await initDb(content, sequelize);
      await sequelize.close();
    })();
  }
};
