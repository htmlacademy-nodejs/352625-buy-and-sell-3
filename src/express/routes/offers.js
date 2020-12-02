'use strict';

const {Router} = require(`express`);

const {getHumanDate, getPageNumbers} = require(`./../utils.js`);
const {render404Page, render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const {checkApiReply, uploadFile, saveFileNameToBody} = require(`../middlewares/`);

const offersRouter = new Router();

offersRouter.get(
    `/add`,
    checkApiReply(),
    async (req, res) => {
      try {
        const auth = await api.getAuth();
        const categories = await api.getCategories();

        res.status(req.apiStatus).render(`new-ticket`, {
          auth,
          categories,
          data: req.apiData,
          errors: req.apiErrors,
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
    uploadFile.single(`offer_picture`),
    saveFileNameToBody(`offer_picture`),
    async (req, res) => {
      try {
        await api.postOffer(req.body);

        res.redirect(`/my`);
        logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.redirect(`/offers/add?data=${JSON.stringify(error.response.data)}`);
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
    checkApiReply(),
    async (req, res) => {
      try {
        const categories = await api.getCategories();
        const offer = await api.getOffer(req.params.offerId);
        const auth = await api.getAuth();

        res.status(req.apiStatus).render(`ticket-edit`, {
          auth,
          offer,
          categories,
          data: req.apiData,
          errors: req.apiErrors,
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
    uploadFile.single(`offer_picture`),
    saveFileNameToBody(`offer_picture`),
    async (req, res) => {
      try {
        await api.editOffer(req.body, offerId);

        res.redirect(`/offers/${req.params.offerId}`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.redirect(`/offers/edit/${req.params.offerId}?data=${JSON.stringify(error.response.data)}`);
        logger.error(`Error occurs: ${error}`);
      }
    }
);

offersRouter.get(
    `/:offerId`,
    checkApiReply(),
    async (req, res) => {
      try {
        const auth = await api.getAuth();
        const offer = await api.getOffer(req.params.offerId);

        res.status(req.apiStatus).render(`ticket`, {
          auth,
          offer,
          getHumanDate,
          data: req.apiData,
          errors: req.apiErrors,
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
    async (req, res) => {
      try {
        await api.postComment(req.body, req.params.offerId);

        res.redirect(`/offers/${req.params.offerId}`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.redirect(`/offers/${req.params.offerId}?data=${JSON.stringify(error.response.data)}`);
        logger.error(`Error occurs: ${error}`);
      }
    }
);

module.exports = offersRouter;
