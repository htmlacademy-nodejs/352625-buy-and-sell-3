'use strict';

const moment = require(`moment`);
const fs = require(`fs`);
const chalk = require(`chalk`);
const {promisify} = require(`util`);
const nanoid = require(`nanoid`);

const {
  OfferType,
  SumRestrict,
  Picture,
  ExitCode,
  Time,
  Id,
  Comment,
  Category,
} = require(`./cli/constants.js`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getPictureFileName = (value) => ({
  normal: value >= Picture.Restrict.BORDER
    ? `${Picture.NAME}${value}.${Picture.DIMENSION}`
    : `${Picture.NAME}0${value}.${Picture.DIMENSION}`,

  double: value >= Picture.Restrict.BORDER
    ? `${Picture.NAME}${value}@2x.${Picture.DIMENSION}`
    : `${Picture.NAME}0${value}@2x.${Picture.DIMENSION}`
});

const getComments = (count, comments, users) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(Id.Length.COMMENT),
    text: `${shuffle(comments).slice(1, getRandomInt(Comment.Phrases.MIN, Comment.Phrases.MAX)).join(`. `)}.`,
    author: getUsers(users)[getRandomInt(0, users.length - 1)],
  }))
);

const getDate = () => {
  const date = Date.now() + getRandomInt(Time.MIN, Time.MAX);
  return {
    machine: moment(date).valueOf(),
    human: moment(date).format(`YYYY-MM-DD HH:mm:ss`),
  };
};

const getUsers = (users) => users
  .map((user, index) => {
    const [name, emailPrefix] = user.split(`, `);
    return {
      id: emailPrefix,
      name,
      email: `${emailPrefix}@gmail.com`,
      avatar: `avatar0${index + 1}`,
    };
  });

const getCategories = (categories) => categories
  .map((category, index) => ({
    id: nanoid(Id.Length.CATEGORY),
    name: category,
    picture: {
      normal: index === 0 ? `cat.jpg` : `cat0${index + 1}.jpg`,
      double: index === 0 ? `cat@2x.jpg` : `cat0${index + 1}@2x.jpg`,
    },
  }));

const generateOffers = (count, sentences, categories, titles, comments, users) => {
  const categoriesList = getCategories(categories);

  return Array(count).fill({}).map(() => ({
    id: nanoid(Id.Length.OFFER),
    author: getUsers(users)[getRandomInt(0, users.length - 1)],
    category: shuffle(categoriesList).slice(1, getRandomInt(Category.Restrict.MIN, Category.Restrict.MAX)),
    createdDate: getDate(),
    description: `${shuffle(sentences).slice(1, 5).join(`. `)}.`,
    picture: getPictureFileName(getRandomInt(Picture.Restrict.MIN, Picture.Restrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: Object.values(OfferType)[Math.floor(Math.random() * Object.values(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    comments: getComments(getRandomInt(Comment.Restrict.MIN, Comment.Restrict.MAX), comments, users),
  }));
};

const makeList = (text) => text
  .replace(/\r?\n/g, ` `)
  .split(`. `)
  .slice(0, -1);

const getFileData = async (path) => {
  const readFile = promisify(fs.readFile);

  try {
    return makeList(await readFile(path, `utf8`));

  } catch (error) {
    console.error(`Can't read data from file... ${error}`);
    return process.exit(ExitCode.FAILURE);
  }
};

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

module.exports = {
  getRandomInt,
  shuffle,
  getPictureFileName,
  generateOffers,
  getFileData,
  writeOffers,
};
