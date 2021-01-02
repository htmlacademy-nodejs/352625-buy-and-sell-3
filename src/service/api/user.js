'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants.js`);
const {tryToResponse, validateUser, authenticate} = require(`../middlewares`);

const userSchema = require(`../schemas/user.js`);


module.exports = (app, userService) => {
  const route = new Router();

  app.use(`/api/user`, route);

  route.post(
      `/`,
      validateUser(userSchema, userService.findOneByEmail.bind(userService)),
      async (req, res, next) => {
        await userService.add(req.body);
        res.body = `User is registered`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );

  route.post(
      `/login`,
      // validateUser(userSchema),
      authenticate(userService),
      tryToResponse(HttpCode.OK)
  );

  route.post(
      `/logout`,
      async (req, res, next) => {
        await userService.logout();
        next();
      },
      tryToResponse(HttpCode.OK)
  );
};
