'use strict';

const uploadFile = require(`../middlewares/upload-file.js`);
const saveFileNameToBody = require(`../middlewares/save-filename-to-request-body.js`);
const isAuth = require(`../middlewares/is-auth.js`);

module.exports = {
  uploadFile,
  saveFileNameToBody,
  isAuth,
};
