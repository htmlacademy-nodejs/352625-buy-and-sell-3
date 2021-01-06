'use strict';

const {Router} = require(`express`);
const {HttpCode, PathName, Empty} = require(`../constants.js`);

const {
  passProperParam,
  tryToResponse,
  isSomeData,
  isUser,
  isOwner,
  isCommentExist,
  isOfferExist,
  validateComment,
} = require(`../middlewares`);

const commentSchema = require(`../schemas/comment.js`);

module.exports = (app, commentService, offerService, userService) => {
  const route = new Router();

  app.use(`/${PathName.COMMENTS}`, route);

  route.get(
      `/`,
      isSomeData(commentService.findAll.bind(commentService)),
      tryToResponse(HttpCode.OK),
  );


  route.get(
      `/byOfferId/:offerId`,
      passProperParam(`offerId`, Empty.COMMENTS),
      isSomeData(commentService.findAllByOfferId.bind(commentService), `offerId`),
      tryToResponse(HttpCode.OK)
  );


  route.get(
      `/:commentId`,
      passProperParam(`commentId`, Empty.COMMENT),
      isSomeData(commentService.findOne.bind(commentService), `commentId`),
      tryToResponse(HttpCode.OK)
  );


  route.post(
      `/`,
      isUser(userService),
      isOfferExist(offerService),
      validateComment(commentSchema),
      async (req, res, next) => {
        const {text, userId, offerId} = req.body;
        await commentService.add({text, userId, offerId});
        res.body = `Comment is created`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );


  route.delete(
      `/`,
      isUser(userService),
      isCommentExist(commentService),
      isOwner(commentService, `commentId`),
      async (req, res, next) => {
        const {commentId} = req.body;
        commentService.delete(commentId);
        res.body = `Comment is deleted`;
        next();
      },
      tryToResponse(HttpCode.OK)
  );
};
