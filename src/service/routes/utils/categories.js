'use strict';

const {db} = require(`./../../../data/db/db.js`);

const getCategories = async () => {
  return await db.Category.findAll();
};

module.exports = {getCategories};
