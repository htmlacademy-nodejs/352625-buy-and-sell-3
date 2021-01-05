'use strict';

const uploadFile = require(`../middlewares/upload-file.js`);
const saveFileNameToBody = require(`../middlewares/save-filename-to-request-body.js`);
const isUser = require(`./is-user.js`);
const setDefaultAuthStatus = require(`./set-default-auth-status.js`);

module.exports = {
  uploadFile,
  saveFileNameToBody,
  isUser,
  setDefaultAuthStatus,
};
