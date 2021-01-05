'use strict';

const {Router} = require(`express`);

const {getHumanDate, getPageNumbers} = require(`./../utils.js`);
const {render404Page, render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const {uploadFile, saveFileNameToBody, setDefaultAuthStatus, isUser} = require(`../middlewares`);

const offersRouter = new Router();

offersRouter.get(
    `/add`,
    setDefaultAuthStatus(),
    isUser(),
    async (req, res) => {
      try {
        res.render(`new-ticket`, {
          auth: req.session[`auth`],
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
    setDefaultAuthStatus(),
    uploadFile.single(`offer_picture`),
    saveFileNameToBody(`offer_picture`),
    isUser(),
    async (req, res) => {
      try {
        const {userId, title, description, categories, sum, type, offerPicture} = req.body;

        await api.postOffer({userId, title, description, categories, sum, type, offerPicture});

        res.redirect(`/my`);
        logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.status(error.response.data[`status`]).render(`new-ticket`, {
          auth: req.session[`auth`],
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
    setDefaultAuthStatus(),
    async (req, res) => {
      try {
        const {activeCategory, offers} = await api.getCategory(req.params.categoryId, req.params.pageNumber);
        const categories = await api.getCategories();
        const auth = req.session[`auth`];
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
    setDefaultAuthStatus(),
    (req, res) => res.redirect(`/offers/category/id=${req.params.categoryId}&page=1`)
);

offersRouter.get(
    `/edit/:offerId`,
    setDefaultAuthStatus(),
    isUser(),
    async (req, res) => {
      try {
        res.render(`ticket-edit`, {
          auth: req.session[`auth`],
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
    setDefaultAuthStatus(),
    uploadFile.single(`offer_picture`),
    saveFileNameToBody(`offer_picture`),
    isUser(),
    async (req, res) => {
      try {
        const offerId = parseInt(req.params[`offerId`], 10) || null;
        const {userId, title, description, categories, sum, type, offerPicture} = req.body;

        await api.editOffer({userId, title, description, categories, sum, type, offerPicture, offerId});

        res.redirect(`/offers/${req.params.offerId}`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.status(error.response.data[`status`]).render(`ticket-edit`, {
          auth: req.session[`auth`],
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
    setDefaultAuthStatus(),
    async (req, res) => {
      try {
        res.render(`ticket`, {
          auth: req.session[`auth`],
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
    setDefaultAuthStatus(),
    isUser(),
    async (req, res) => {
      try {
        const offerId = parseInt(req.params[`offerId`], 10) || null;
        const {text, userId} = req.body;

        await api.postComment({text, userId, offerId});

        res.redirect(`/offers/${req.params[`offerId`]}`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.status(error.response.data[`status`]).render(`ticket`, {
          auth: req.session[`auth`],
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
