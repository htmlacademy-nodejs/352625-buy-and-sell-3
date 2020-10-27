'use strict';

const {Router} = require(`express`);

const {getHumanDate} = require(`./../utils.js`);
const {render404Page, render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const myRouter = new Router();

myRouter.get(
    `/`,
    async (req, res) => {
      try {
        const auth = await api.getAuth();
        const reqUrl = req.originalUrl;

        if (!auth.status || typeof auth.user.id !== `number`) {
          render404Page(req, res);
        } else {
          const myOffers = await api.getMyOffers(auth.user.id);

          res.render(`my-tickets`, {
            reqUrl,
            auth,
            myOffers,
            getHumanDate,
          });
        }
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        render500Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }

    }
);


myRouter.get(
    `/comments`,
    async (req, res) => {
      try {
        const auth = await api.getAuth();
        const reqUrl = req.originalUrl;

        if (!auth.status || typeof auth.user.id !== `number`) {
          render404Page(req, res);
        } else {
          const myOffers = await api.getMyOffers(auth.user.id);

          res.render(`comments`, {
            reqUrl,
            auth,
            myOffers,
          });
        }
        logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

      } catch (error) {
        render500Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);


myRouter.post(
    `/offers/delete/:offerId`,
    async (req, res) => {
      try {
        const offerId = parseInt(req.params.offerId, 10);

        await api.deleteOffer(offerId);

        res.redirect(`/my/`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        logger.error(`Error occurs: ${error}`);
        res.redirect(`/my/`);
      }
    }
);


myRouter.post(`/comments/delete/:commentId`, async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);

    await api.deleteComment(commentId);

    res.redirect(`/my/comments/`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
    res.redirect(`/my/comments/`);
  }
});


module.exports = myRouter;
