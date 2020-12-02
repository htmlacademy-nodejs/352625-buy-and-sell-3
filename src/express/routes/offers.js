'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const nanoid = require(`nanoid`);

const {getHumanDate, getPageNumbers} = require(`./../utils.js`);
const {render404Page, render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const logger = getLogger();

const checkApiReply = require(`../middlewares/check-api-reply.js`);

const offersRouter = new Router();

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

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
    upload.single(`offer_picture`),
    async (req, res) => {
      const {body, file} = req;

      if (file) {
        body[`offer_picture`] = file.filename;
      }
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
        const activeCategoryId = req.params.categoryId;
        const pageNumber = req.params.pageNumber;

        const {activeCategory, offers} = await api.getCategory(activeCategoryId, pageNumber);
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
    upload.single(`offer_picture`),
    async (req, res) => {
      const {body, file} = req;

      if (file) {
        body[`offer_picture`] = file.filename;
      }
      try {
        const offerId = parseInt(req.params.offerId, 10);
        await api.editOffer(req.body, offerId);

        res.redirect(`/offers/${offerId}`);
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
        const offerId = parseInt(req.params.offerId, 10);

        await api.postComment(req.body, offerId);

        res.redirect(`/offers/${offerId}`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.redirect(`/offers/${req.params.offerId}?data=${JSON.stringify(error.response.data)}`);
        logger.error(`Error occurs: ${error}`);
      }
    }
);

module.exports = offersRouter;
