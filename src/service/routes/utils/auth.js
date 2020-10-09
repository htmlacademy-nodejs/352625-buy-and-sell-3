'use strict';

const {db} = require(`./../../../data/db/db.js`);

const getAuth = async () => {
  const authData = await db.Auth.findOne({
    where: {
      [`is_auth`]: true
    },
    include: [`user`],
  });

  let result = {
    status: false,
    user: null,
  };

  if (authData) {
    result = {
      status: authData[`is_auth`],
      user: authData[`user`],
    };
  }

  return result;
};

module.exports = {getAuth};
