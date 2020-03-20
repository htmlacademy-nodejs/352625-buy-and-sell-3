'use strict';

const fs = require(`fs`);
const chalk = require(`chalk`);
const {promisify} = require(`util`);

const {
  OfferType,
  SumRestrict,
  Picture,
  ExitCode,
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

const getPictureFileName = (value) => {
  if (value > Picture.Restrict.BORDER) {
    return `${Picture.NAME}${value}.${Picture.DIMENSION}`;
  }
  return `${Picture.NAME}0${value}.${Picture.DIMENSION}`;
};

const generateOffers = (count, sentences, categories, titles) => (
  Array(count).fill({}).map(() => ({
    category: [categories[getRandomInt(0, categories.length - 1)]],
    description: `${shuffle(sentences).slice(1, 5).join(`. `)}.`,
    picture: getPictureFileName(getRandomInt(Picture.Restrict.MIN, Picture.Restrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: Object.values(OfferType)[Math.floor(Math.random() * Object.values(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
  }))
);

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
