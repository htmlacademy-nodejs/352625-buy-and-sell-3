'use strict';

const {Router} = require(`express`);

const {Items} = require(`../../service/constants.js`);
const {render404Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const homeRouter = new Router();

homeRouter.get(
    `/`,
    async (req, res) => {
      try {
        const offers = await api.getOffers();
        const categories = await api.getCategories();
        const auth = await api.getAuth();
        const freshItems = await api.getFreshItems();
        const mostDiscussedItems = await api.getMostDiscussed();

        res.render(`main`, {
          auth,
          offers,
          categories,
          freshItems,
          mostDiscussedItems,
        });
        logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

      } catch (error) {
        render404Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);

module.exports = homeRouter;
