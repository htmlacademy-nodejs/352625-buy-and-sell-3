'use strict';

const fs = require(`fs`);

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

module.exports = {
  name: CommandsNames.GENERATE,
  run(args) {
    const [count] = args;
    const countOffer = Math.abs(Number.parseInt(count, 10)) || DEFAULT_COUNT;

    if (countOffer < MAX_COUNT) {
      const content = JSON.stringify(generateOffers(countOffer));
      fs.writeFile(FILE_NAME, content, (err) => {
        if (err) {
          console.error(`Can't write data to file...`);
          process.exit(ExitCode.failure);
        }

        console.info(`Operation success. File created.`);
        process.exit(ExitCode.success);
      });

    } else {
      console.error(`Не больше ${MAX_COUNT} объявлений`);
      process.exit(ExitCode.failure);
    }
  }
};
