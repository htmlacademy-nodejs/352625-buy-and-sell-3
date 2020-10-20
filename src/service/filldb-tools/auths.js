'use strict';

const getAuth = (users, authUserId) => {
  return users
    .map((user, index) => ({
      [`author_id`]: index + 1,
      [`is_auth`]: (authUserId === index + 1),
    }));
};

module.exports = getAuth;
