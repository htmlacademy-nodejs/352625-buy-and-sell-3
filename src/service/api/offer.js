'use strict';

const {Router} = require(`express`);
const {HttpCode, PathName, Empty} = require(`../constants.js`);

const {
  passProperParam,
  tryToResponse,
  validateOffer,
  isSomeData,
  isUser,
  isOfferExist,
  isOwner,
} = require(`../middlewares`);

const offerSchema = require(`../schemas/offer.js`);

module.exports = (app, offerService, commentService, userService) => {
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
      isSomeData(offerService.findOne.bind(offerService), `offerId`),
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
      isUser(userService),
      validateOffer(offerSchema),
      async (req, res, next) => {
        const {userId, title, description, categories, sum, type, offerPicture} = req.body;
        await offerService.add({userId, title, description, categories, sum, type, offerPicture});
        res.body = `Offer is created`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );


  route.put(
      `/`,
      isUser(userService),
      isOfferExist(offerService),
      isOwner(offerService, `offerId`),
      validateOffer(offerSchema),
      async (req, res, next) => {
        const {title, description, categories, sum, type, offerPicture, offerId} = req.body;
        await offerService.update({title, description, categories, sum, type, offerPicture, offerId});
        res.body = `Offer is changed`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );


  route.delete(
      `/`,
      isUser(userService),
      isOfferExist(offerService),
      isOwner(offerService, `offerId`),
      async (req, res, next) => {
        const {userId, offerId} = req.body;
        await offerService.delete({userId, offerId});
        res.body = `Offer is deleted`;
        next();
      },
      tryToResponse(HttpCode.OK)
  );
};

