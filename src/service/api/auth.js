'use strict';

const {Router} = require(`express`);
const {HttpCode, PathName} = require(`../constants.js`);
const {tryToResponse} = require(`../middlewares`);


module.exports = (app, authService) => {
  const route = new Router();

  app.use(`/${PathName.AUTH}`, route);

  route.get(
      `/`,
      async (req, res, next) => {
        res.body = await authService.get();
        next();
      },
      tryToResponse(HttpCode.OK)
  );
};
