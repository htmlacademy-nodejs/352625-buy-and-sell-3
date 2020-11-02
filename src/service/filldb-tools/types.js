'use strict';

const getTypes = (types) => Object.values(types)
  .map((type) => ({name: type}));

module.exports = getTypes;
