'use strict';

const {Router} = require(`express`);

const {getHumanDate} = require(`./../utils.js`);
const {render404Page, render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const offersRouter = new Router();

offersRouter.get(
    `/add`,
    async (req, res) => {
      try {
        const auth = await api.getAuth();
        const categories = await api.getCategories();

        res.render(`new-ticket`, {
          auth,
          categories,
        });
        logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

      } catch (error) {
        render500Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);

offersRouter.post(
    `/add`,
    (req, res) => {
      try {
        // TODO не работает
        api.postOffer(req.body);

        res.redirect(`/my`);
        logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

      } catch (error) {
        logger.error(`Error occurs: ${error}`);

        res.redirect(`/offers/add`);
      }
    }
);

offersRouter.get(
    `/category/:categoryId`,
    async (req, res) => {
      try {
        const activeCategoryId = req.params.categoryId;
        const activeCategory = await api.getCategory(activeCategoryId);
        const categories = await api.getCategories();
        const auth = await api.getAuth();

        res.render(`category`, {
          auth,
          categories,
          activeCategory,
          activeCategoryId,
        });
        logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

      } catch (error) {
        render404Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);

offersRouter.get(
    `/edit/:offerId`,
    async (req, res) => {
      try {
        const categories = await api.getCategories();
        const offer = await api.getOffer(req.params.offerId);
        const auth = await api.getAuth();

        res.render(`ticket-edit`, {
          auth,
          offer,
          categories,
        });
        logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

      } catch (error) {
        render404Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);

offersRouter.get(
    `/:offerId`,
    async (req, res) => {
      try {
        const auth = await api.getAuth();
        const offer = await api.getOffer(req.params.offerId);

        res.render(`ticket`, {
          auth,
          offer,
          getHumanDate,
        });
        logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

      } catch (error) {
        render404Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);

module.exports = offersRouter;
