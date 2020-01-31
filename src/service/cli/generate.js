'use strict';

const fs = require(`fs`);

const {
  CommandsNames,
  ExitCode
} = require(`./constants.js`);

const {
  getRandomInt,
  shuffle
} = require(`./../utils.js`);

const {
  DEFAULT_COUNT,
  MAX_COUNT,
  FILE_NAME,
  TITLES,
  SENTENCES,
  CATEGORIES,
  OfferType,
  SumRestrict,
  Picture
} = require(`./mocks.js`);

const getPictureFileName = (value) => {
  if (value > Picture.Restrict.border) {
    return `${Picture.NAME}${value}.${Picture.DIMENSION}`;
  }
  return `${Picture.NAME}0${value}.${Picture.DIMENSION}`;
};

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    category: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]],
    description: shuffle(SENTENCES).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(Picture.Restrict.min, Picture.Restrict.max)),
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.min, SumRestrict.max),
  }))
);

module.exports = {
  name: CommandsNames.GENERATE,
  run(args) {
    const [count] = args;
    const countOffer = Math.abs(Number.parseInt(count, 10)) || DEFAULT_COUNT;

    if (countOffer < MAX_COUNT) {
      const content = JSON.stringify(generateOffers(countOffer));
      fs.writeFile(FILE_NAME, content, (err) => {
        if (err) {
          return console.error(`Can't write data to file...`);
        }

        return console.info(`Operation success. File created.`);
      });

    } else {
      console.error(`Не больше ${MAX_COUNT} объявлений`);
      process.exit(ExitCode.failure);
    }
  }
};
