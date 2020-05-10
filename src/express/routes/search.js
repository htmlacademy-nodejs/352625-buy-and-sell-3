'use strict';

const {Router} = require(`express`);

const {UriApi} = require(`./utils.js`);
const {renderSearchResultsPage} = require(`./render.js`);

const searchRouter = new Router();

searchRouter.get(
    `/`,
    (req, res) => renderSearchResultsPage(
        req,
        res,
        UriApi.AUTH,
        UriApi.SEARCH,
        UriApi.OFFERS
    )
);

module.exports = searchRouter;
