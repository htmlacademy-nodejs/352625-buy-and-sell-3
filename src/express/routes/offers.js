'use strict';

const {Router} = require(`express`);

const {getHumanDate, getPageNumbers} = require(`./../utils.js`);
const {render404Page, render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const {uploadFile, saveFileNameToBody, isAuth} = require(`../middlewares`);

const offersRouter = new Router();

offersRouter.get(
    `/add`,
    isAuth(api.getAuth.bind(api)),
    async (req, res) => {
      try {
        res.render(`new-ticket`, {
          auth: res.auth,
          categories: await api.getCategories(),
          data: null,
          errors: null,
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
    isAuth(api.getAuth.bind(api)),
    uploadFile.single(`offer_picture`),
    saveFileNameToBody(`offer_picture`),
    async (req, res) => {
      try {
        await api.postOffer(req.body);

        res.redirect(`/my`);
        logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.status(error.response.data[`status`]).render(`new-ticket`, {
          auth: res.auth,
          categories: await api.getCategories(),
          data: error.response.data[`data`],
          errors: error.response.data[`errors`],
        });
        logger.error(`Error occurs: ${error}`);
      }
    }
);

offersRouter.get(
    `/category/id=:categoryId&page=:pageNumber`,
    async (req, res) => {
      try {
        const {activeCategory, offers} = await api.getCategory(req.params.categoryId, req.params.pageNumber);
        const categories = await api.getCategories();
        const auth = await api.getAuth();
        const pageNumbers = getPageNumbers(offers.totalPages);

        res.render(`category`, {
          auth,
          categories,
          activeCategory,
          offers,
          pageNumbers,
        });
        logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

      } catch (error) {
        render404Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);

offersRouter.get(
    `/category/:categoryId`,
    (req, res) => res.redirect(`/offers/category/id=${req.params.categoryId}&page=1`)
);

offersRouter.get(
    `/edit/:offerId`,
    isAuth(api.getAuth.bind(api)),
    async (req, res) => {
      try {
        res.render(`ticket-edit`, {
          auth: res.auth,
          offer: await api.getOffer(req.params[`offerId`]),
          categories: await api.getCategories(),
          data: null,
          errors: null,
        });
        logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

      } catch (error) {
        render404Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);

offersRouter.post(
    `/edit/:offerId`,
    isAuth(api.getAuth.bind(api)),
    uploadFile.single(`offer_picture`),
    saveFileNameToBody(`offer_picture`),
    async (req, res) => {
      try {
        await api.editOffer(req.body, req.params.offerId);

        res.redirect(`/offers/${req.params.offerId}`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.status(error.response.data[`status`]).render(`ticket-edit`, {
          auth: res.auth,
          offer: await api.getOffer(req.params[`offerId`]),
          categories: await api.getCategories(),
          data: error.response.data[`data`],
          errors: error.response.data[`errors`],
        });
        logger.error(`Error occurs: ${error}`);
      }
    }
);

offersRouter.get(
    `/:offerId`,
    async (req, res) => {
      try {
        res.render(`ticket`, {
          auth: await api.getAuth(),
          offer: await api.getOffer(req.params[`offerId`]),
          getHumanDate,
          data: null,
          errors: null,
        });
        logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

      } catch (error) {
        render404Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);

offersRouter.post(
    `/:offerId/comments`,
    isAuth(api.getAuth.bind(api)),
    async (req, res) => {
      try {
        await api.postComment(req.body, req.params[`offerId`]);

        res.redirect(`/offers/${req.params[`offerId`]}`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.status(error.response.data[`status`]).render(`ticket`, {
          auth: await api.getAuth(),
          offer: await api.getOffer(req.params[`offerId`]),
          getHumanDate,
          data: error.response.data[`data`],
          errors: error.response.data[`errors`],
        });
        logger.error(`Error occurs: ${error}`);
      }
    }
);

module.exports = offersRouter;
