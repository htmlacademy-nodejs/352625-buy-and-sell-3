'use strict';

const {Router} = require(`express`);
const {HttpCode, PathName, Empty} = require(`../constants.js`);

const {tryToResponse} = require(`../middlewares`);


module.exports = (app, searchService) => {
  const route = new Router();

  app.use(`/${PathName.SEARCH}`, route);

  route.get(
      `/`,
      async (req, res, next) => {
        const typingData = req.query.query;
        res.body = await searchService.findSome(typingData);

        if (typingData === ``) {
          res.body = Empty.SEARCH;
        }

        next();
      },
      tryToResponse(HttpCode.OK)
  );
};

