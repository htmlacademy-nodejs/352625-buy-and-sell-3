'use strict';

const getTypes = (types) => Object.values(types)
  .map((type, index) => ([index + 1, ` '${type}'`]));

module.exports = getTypes;
