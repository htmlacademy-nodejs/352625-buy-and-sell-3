'use strict';

const {sequelize, initDb} = require(`./db.js`);

const content = require(`./mocks.js`);

(async () => {
  await initDb(content);
  await sequelize.close();
})();
