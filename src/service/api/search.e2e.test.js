'use strict';

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search.js`);
const SearchService = require(`../data-service/search.js`);

const {HttpCode, PathName, Empty, SEARCH_PARAM} = require(`../constants.js`);
const mocks = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const RIGHT_SEARCH = `НАручные`;
const RIGHT_SEARCH_URI = encodeURI(RIGHT_SEARCH);

const WRONG_SEARCH = `ылдвапрдлорвап`;
const WRONG_SEARCH_URI = encodeURI(WRONG_SEARCH);

const searchService = new SearchService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  search(app, searchService);
  return app;
};

beforeAll(async () => {
  await initDb(mocks, fakeSequelize);
});

afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});


describe(`When GET '${PathName.SEARCH}${SEARCH_PARAM}${RIGHT_SEARCH_URI}'`, () => {
  const app = createAPI();

  let response;
  const result = [{
    categories: [
      {id: 1, name: `Книги`}, {id: 2, name: `Разное`}, {id: 3, name: `Посуда`}
    ],
    description: `Если найдёте дешевле — сброшу цену. Таких предложений больше нет!`,
    id: 2,
    picture: {
      double: `item02@2x.jpg`,
      normal: `item02.jpg`
    },
    sum: `8340`,
    title: `наручные часы`,
    type: {
      name: `Продам`
    }
  }];

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.SEARCH}${SEARCH_PARAM}${RIGHT_SEARCH_URI}`);
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`request '${SEARCH_PARAM}${RIGHT_SEARCH_URI}' should return items by ${RIGHT_SEARCH} in title`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '${PathName.SEARCH}${SEARCH_PARAM}${WRONG_SEARCH_URI}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.SEARCH}${SEARCH_PARAM}${WRONG_SEARCH_URI}`);
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`request '${SEARCH_PARAM}${WRONG_SEARCH_URI}' should return ${Empty.SEARCH}`, () => {
    expect(response.body).toStrictEqual(Empty.SEARCH);
  });
});


describe(`When GET '${PathName.SEARCH}${SEARCH_PARAM}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.SEARCH}${SEARCH_PARAM}`);
  });

  test(`blank search returns '${Empty.SEARCH}'`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toStrictEqual(Empty.SEARCH);
  });
});


describe(`When GET '${PathName.SEARCH}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.SEARCH}`);
  });

  test(`blank search returns '${Empty.SEARCH}'`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toStrictEqual(Empty.SEARCH);
  });
});
