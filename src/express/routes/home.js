'use strict';

const {Router} = require(`express`);

const {render404Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {setDefaultAuthStatus} = require(`../middlewares`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const homeRouter = new Router();

homeRouter.get(
    `/`,
    setDefaultAuthStatus(),
    async (req, res) => {
      try {
        res.render(`main`, {
          auth: req.session[`auth`],
          offers: await api.getOffers(),
          categories: await api.getCategories(),
          freshItems: await api.getFreshItems(),
          mostDiscussedItems: await api.getMostDiscussed(),
        });
        logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

      } catch (error) {
        render404Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);

module.exports = homeRouter;
