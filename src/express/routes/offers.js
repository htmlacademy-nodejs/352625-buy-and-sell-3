'use strict';

const {Router} = require(`express`);

const {UriApi} = require(`./utils.js`);
const {
  renderCategoryPage,
  renderTicketPage,
  renderTicketEditPage,
  renderNewTicketPage,
  postFormDataToService,
} = require(`./render.js`);

const offersRouter = new Router();

offersRouter.get(
    `/add`,
    (req, res) => renderNewTicketPage(
        req,
        res,
        UriApi.AUTH,
        UriApi.CATEGORIES
    )
);

offersRouter.post(
    `/add`,
    (req, res) => postFormDataToService(
        req,
        res,
        UriApi.OFFERS
    )
);

offersRouter.get(
    `/category/:categoryId`,
    (req, res) => renderCategoryPage(
        req,
        res,
        UriApi.AUTH,
        UriApi.OFFERS,
        UriApi.CATEGORIES
    )
);

offersRouter.get(
    `/edit/:offerId`,
    (req, res) => renderTicketEditPage(
        req,
        res,
        UriApi.AUTH,
        UriApi.OFFERS,
        UriApi.CATEGORIES
    )
);

offersRouter.get(
    `/:offerId`,
    (req, res) => renderTicketPage(
        req,
        res,
        UriApi.AUTH,
        UriApi.OFFERS
    )
);

module.exports = offersRouter;
