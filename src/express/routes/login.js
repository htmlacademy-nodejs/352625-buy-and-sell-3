'use strict';

const {Router} = require(`express`);

const {render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {setDefaultAuthStatus} = require(`../middlewares`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const loginRouter = new Router();

loginRouter.get(
    `/`,
    setDefaultAuthStatus(),
    (req, res) => {
      try {
        res.render(`login`, {
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

loginRouter.post(
    `/`,
    setDefaultAuthStatus(),
    async (req, res) => {
      try {
        req.session[`auth`] = await api.login(req.body);
        // TODO после успешного логина - происходит редирект на главную страницу с анонимным header-ом, помогает только обновление страницы вручную.
        res.redirect(`/`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.status(error.response.data[`status`]).render(`login`, {
          data: error.response.data[`data`],
          errors: error.response.data[`errors`],
        });
        logger.error(`Error occurs: ${error}`);

      }
    }
);

module.exports = loginRouter;
