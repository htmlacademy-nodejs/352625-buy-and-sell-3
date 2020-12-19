'use strict';

const {Router} = require(`express`);

const {getHumanDate} = require(`./../utils.js`);
const {render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const {isAuth} = require(`../middlewares`);

const myRouter = new Router();

myRouter.get(
    `/`,
    isAuth(api.getAuth.bind(api)),
    async (req, res) => {
      try {
        const reqUrl = req.originalUrl;
        const myOffers = await api.getMyOffers(res.auth.user.id);

        res.render(`my-tickets`, {
          reqUrl,
          auth: res.auth,
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
    isAuth(api.getAuth.bind(api)),
    async (req, res) => {
      try {
        const reqUrl = req.originalUrl;
        const myOffers = await api.getMyOffers(res.auth.user.id);

        res.render(`comments`, {
          reqUrl,
          auth: res.auth,
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
    isAuth(api.getAuth.bind(api)),
    async (req, res) => {
      try {
        await api.deleteOffer(req.params.offerId);

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
    isAuth(api.getAuth.bind(api)),
    async (req, res) => {
      try {
        const commentId = parseInt(req.params.commentId, 10);

        await api.deleteComment(commentId);

        res.redirect(`/my/comments/`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        logger.error(`Error occurs: ${error}`);
        res.redirect(`/my/comments/`);
      }
    }
);


module.exports = myRouter;
