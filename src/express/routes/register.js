'use strict';

const {Router} = require(`express`);

const {render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const {uploadFile, saveFileNameToBody, setDefaultAuthStatus} = require(`../middlewares`);

const registerRouter = new Router();

registerRouter.get(
    `/`,
    setDefaultAuthStatus(),
    (req, res) => {
      try {
        res.render(`sign-up`, {
          data: null,
          errors: null,
        });
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        render500Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);

registerRouter.post(
    `/`,
    setDefaultAuthStatus(),
    uploadFile.single(`avatar`),
    saveFileNameToBody(`avatar`),
    async (req, res) => {
      try {
        await api.register(req.body);
        res.redirect(`/login`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.status(error.response.data[`status`]).render(`sign-up`, {
          data: error.response.data[`data`],
          errors: error.response.data[`errors`],
        });
        logger.error(`Error occurs: ${error}`);
      }
    }
);


module.exports = registerRouter;
