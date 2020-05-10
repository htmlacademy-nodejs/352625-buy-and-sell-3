'use strict';

const {Router} = require(`express`);

const {UriApi} = require(`./utils.js`);
const {renderMyTicketsPage, renderCommentsPage} = require(`./render.js`);

const myRouter = new Router();

myRouter.get(
    `/`,
    (req, res) => renderMyTicketsPage(
        req,
        res,
        UriApi.AUTH,
        req.originalUrl
    )
);

myRouter.get(
    `/comments`,
    (req, res) => renderCommentsPage(
        req,
        res,
        UriApi.AUTH,
        req.originalUrl
    )
);

module.exports = myRouter;
