'use strict';

const {Router} = require(`express`);

const {getHumanDate} = require(`./../utils.js`);
const {render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const {setDefaultAuthStatus, isUser} = require(`../middlewares`);

const myRouter = new Router();

myRouter.get(
    `/`,
    setDefaultAuthStatus(),
    isUser(),
    async (req, res) => {
      try {
        const reqUrl = req.originalUrl;
        const myOffers = await api.getMyOffers(req.session[`auth`][`user`][`id`]);

        res.render(`my-tickets`, {
          reqUrl,
          auth: req.session[`auth`],
          myOffers,
          getHumanDate,
        });
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        render500Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }

    }
);


myRouter.get(
    `/comments`,
    setDefaultAuthStatus(),
    isUser(),
    async (req, res) => {
      try {
        const reqUrl = req.originalUrl;
        const myOffers = await api.getMyOffers(req.session[`auth`][`user`][`id`]);

        res.render(`comments`, {
          reqUrl,
          auth: req.session[`auth`],
          myOffers,
        });
        logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

      } catch (error) {
        render500Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);


myRouter.post(
    `/offers/delete/:offerId`,
    setDefaultAuthStatus(),
    isUser(),
    async (req, res) => {
      try {
        const offerId = parseInt(req.params[`offerId`], 10) || null;
        const userId = req.session[`auth`][`user`][`id`] || null;

        await api.deleteOffer({userId, offerId});

        res.redirect(`/my/`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        logger.error(`Error occurs: ${error}`);
        res.redirect(`/my/`);
      }
    }
);


myRouter.post(
    `/comments/delete/:commentId`,
    setDefaultAuthStatus(),
    isUser(),
    async (req, res) => {
      try {
        const commentId = parseInt(req.params.commentId, 10) || null;
        const userId = req.session[`auth`][`user`][`id`] || null;

        await api.deleteComment({userId, commentId});

        res.redirect(`/my/comments/`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        logger.error(`Error occurs: ${error}`);
        res.redirect(`/my/comments/`);
      }
    }
);


module.exports = myRouter;
