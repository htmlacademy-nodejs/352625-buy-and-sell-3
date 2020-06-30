'use strict';

const {Router} = require(`express`);

const {UriApi} = require(`./utils.js`);
const {renderHomePage} = require(`./render.js`);

const homeRouter = new Router();

homeRouter.get(
    `/`,
    (req, res) => renderHomePage(req, res)
);

module.exports = homeRouter;
