'use strict';

const {Router} = require(`express`);

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
    (req, res) => renderNewTicketPage(req, res)
);

offersRouter.post(
    `/add`,
    (req, res) => postFormDataToService(req, res)
);

offersRouter.get(
    `/category/:categoryId`,
    (req, res) => renderCategoryPage(req, res)
);

offersRouter.get(
    `/edit/:offerId`,
    (req, res) => renderTicketEditPage(req, res)
);

offersRouter.get(
    `/:offerId`,
    (req, res) => renderTicketPage(req, res)
);

module.exports = offersRouter;
