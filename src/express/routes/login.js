'use strict';

const {Router} = require(`express`);
const PathName = require(`./constants.js`);

const loginRouter = new Router();

loginRouter.get(`/`, (req, res) => res.send(`/${PathName.LOGIN}`));
// rootRouter.get(`/${PathName.SEARCH}`, (req, res) => res.send(`/${PathName.SEARCH}`));

module.exports = loginRouter;
