'use strict';

const {Router} = require(`express`);

const {renderSearchResultsPage} = require(`./render.js`);

const searchRouter = new Router();

searchRouter.get(
    `/`,
    (req, res) => renderSearchResultsPage(req, res)
);

module.exports = searchRouter;
