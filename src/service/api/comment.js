'use strict';

const {Router} = require(`express`);
const {HttpCode, PathName, Empty} = require(`../constants.js`);

const {
  isAuth,
  passProperParam,
  tryToResponse,
  isExist,
} = require(`../middlewares`);


module.exports = (app, commentService, authService) => {
  const route = new Router();

  app.use(`/${PathName.COMMENTS}`, route);

  route.get(
      `/`,
      isExist(commentService.findAll.bind(commentService)),
      tryToResponse(HttpCode.OK),
  );


  route.get(
      `/byOfferId/:offerId`,
      passProperParam(`offerId`, Empty.COMMENTS),
      isExist(commentService.findAllByOfferId.bind(commentService), `offerId`),
      tryToResponse(HttpCode.OK)
  );


  route.get(
      `/:commentId`,
      passProperParam(`commentId`, Empty.COMMENT),
      isExist(commentService.findOne.bind(commentService), `commentId`),
      tryToResponse(HttpCode.OK)
  );


  route.delete(
      `/:commentId`,
      isAuth(authService.get.bind(authService)),
      passProperParam(`commentId`, `Incorrect id`),
      isExist(commentService.findOne.bind(commentService), `commentId`),
      async (req, res, next) => {
        commentService.delete(req.params[`commentId`]);
        res.body = `Comment is deleted`;
        next();
      },
      tryToResponse(HttpCode.OK)
  );
};
