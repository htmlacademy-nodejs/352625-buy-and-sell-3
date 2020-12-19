'use strict';

const {Router} = require(`express`);
const {HttpCode, PathName, Empty} = require(`../constants.js`);

const {
  passProperParam,
  tryToResponse,
  isExist,
} = require(`../middlewares`);


module.exports = (app, categoryService) => {
  const route = new Router();

  app.use(`/${PathName.CATEGORIES}`, route);

  route.get(
      `/`,
      isExist(categoryService.findAll.bind(categoryService)),
      tryToResponse(HttpCode.OK)
  );


  route.get(
      `/id=:categoryId&page=:pageNumber`,
      passProperParam(`categoryId`, Empty.CATEGORY),
      passProperParam(`pageNumber`, Empty.CATEGORY),
      isExist(categoryService.findOne.bind(categoryService), `categoryId`, `pageNumber`),
      tryToResponse(HttpCode.OK)
  );
};

