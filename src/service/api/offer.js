'use strict';

const {Router} = require(`express`);
const {HttpCode, PathName, Empty} = require(`../constants.js`);

const {
  passProperParam,
  isAuth,
  tryToResponse,
  validateOffer,
  validateComment,
  isExist,
} = require(`../middlewares`);

const offerSchema = require(`../schemas/offer.js`);
const commentSchema = require(`../schemas/comment.js`);

module.exports = (app, offerService, commentService, authService) => {
  const route = new Router();

  app.use(`/${PathName.OFFERS}`, route);

  route.get(
      `/`,
      async (req, res, next) => {
        res.body = await offerService.findAll();
        next();
      },
      tryToResponse(HttpCode.OK)
  );


  route.get(
      `/fresh`,
      async (req, res, next) => {
        res.body = await offerService.findFresh();
        next();
      },
      tryToResponse(HttpCode.OK)
  );


  route.get(
      `/mostDiscussed`,
      async (req, res, next) => {
        res.body = await offerService.findMostDiscussed();
        next();
      },
      tryToResponse(HttpCode.OK)
  );

  route.get(
      `/:offerId`,
      passProperParam(`offerId`, `Incorrect id`),
      isExist(offerService.findOne.bind(offerService), `offerId`),
      async (req, res, next) => {
        res.body = await offerService.findOne(req.params[`offerId`]);
        next();
      },
      tryToResponse(HttpCode.OK)
  );


  route.get(
      `/:offerId/comments`,
      passProperParam(`offerId`, Empty.COMMENTS),
      async (req, res, next) => {
        res.body = await commentService.findAllByOfferId(req.params[`offerId`]);
        next();
      },
      tryToResponse(HttpCode.OK)
  );


  route.get(
      `/byAuthorId/:authorId`,
      passProperParam(`authorId`, Empty.OFFERS),
      async (req, res, next) => {
        res.body = await offerService.findAllByAuthorId(req.params[`authorId`]);
        next();
      },
      tryToResponse(HttpCode.OK)
  );


  route.post(
      `/`,
      isAuth(authService.get.bind(authService)),
      validateOffer(offerSchema),
      async (req, res, next) => {
        await offerService.add(req.body, res.auth.user.id);
        res.body = `Offer is created`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );


  route.put(
      `/:offerId`,
      isAuth(authService.get.bind(authService)),
      passProperParam(`offerId`, `Incorrect id`),
      isExist(offerService.findOne.bind(offerService), `offerId`),
      validateOffer(offerSchema),
      async (req, res, next) => {
        await offerService.update(req.body, req.params[`offerId`]);
        res.body = `Offer is changed`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );


  route.delete(
      `/:offerId`,
      isAuth(authService.get.bind(authService)),
      passProperParam(`offerId`, `Incorrect id`),
      isExist(offerService.findOne.bind(offerService), `offerId`),
      async (req, res, next) => {
        await offerService.delete(req.params[`offerId`]);
        res.body = `Offer is deleted`;
        next();
      },
      tryToResponse(HttpCode.OK)
  );


  route.post(
      `/:offerId/comments`,
      isAuth(authService.get.bind(authService)),
      passProperParam(`offerId`, `Incorrect id`),
      isExist(offerService.findOne.bind(offerService), `offerId`),
      validateComment(commentSchema),
      async (req, res, next) => {
        await commentService.add(req.body, req.params[`offerId`], res.auth.user.id);
        res.body = `Comment is created`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );
};

