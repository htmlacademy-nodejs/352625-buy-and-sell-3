'use strict';

const {Router} = require(`express`);

const offer = require(`./offer.js`);
const category = require(`./category.js`);
const search = require(`./search.js`);
const comment = require(`./comment.js`);
const user = require(`./user.js`);

const {
  OfferService,
  CategoryService,
  CommentService,
  SearchService,
  UserService,
} = require(`./../data-service`);

const app = new Router();

(async () => {
  category(app, new CategoryService());
  comment(app, new CommentService(), new OfferService(), new UserService());
  search(app, new SearchService());
  offer(app, new OfferService(), new CommentService(), new UserService());
  user(app, new UserService());
})();

module.exports = app;
