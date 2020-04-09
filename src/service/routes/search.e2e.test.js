'use strict';

const request = require(`supertest`);

const {app} = require(`./../cli/server.js`);
const {PathName, Empty, SEARCH_PARAM} = require(`./../routes/constants.js`);

const RIGHT_SEARCH = encodeURI(`Продам`);
const WRONG_SEARCH = encodeURI(`ылдвапрдлорвап`);

describe(`When GET '/${PathName.SEARCH}'`, () => {
  test(`status code should be 200`, async () => {
    const res = await request(app).get(`/${PathName.SEARCH}`);
    expect(res.statusCode).toBe(200);
  });

  test(`request '${SEARCH_PARAM}${RIGHT_SEARCH}' returns array of objects`, async () => {
    const res = await request(app)
      .get(`/${PathName.SEARCH}${SEARCH_PARAM}${RIGHT_SEARCH}`);

    expect(Array.isArray(res.body)).toBeTruthy();

    for (let item of res.body) {
      expect(typeof item).toBe(`object`);
      expect(item).toHaveProperty(`id`);
      expect(item).toHaveProperty(`category`);
      expect(item).toHaveProperty(`description`);
      expect(item).toHaveProperty(`picture`);
      expect(item).toHaveProperty(`title`);
      expect(item).toHaveProperty(`type`);
      expect(item).toHaveProperty(`sum`);
      expect(item).toHaveProperty(`comments`);
    }
  });

  test(`blank search returns '${Empty.SEARCH}' string`, async () => {
    const res = await request(app)
      .get(`/${PathName.SEARCH}`);
    expect(res.body).toBe(Empty.SEARCH);
  });

  test(`blank request '${SEARCH_PARAM}' returns '${Empty.SEARCH}' string`, async () => {
    const res = await request(app)
      .get(`/${PathName.SEARCH}${SEARCH_PARAM}`);
    expect(res.body).toBe(Empty.SEARCH);
  });

  test(`wrong request '${SEARCH_PARAM}${WRONG_SEARCH}' returns '${Empty.SEARCH}' string`, async () => {
    const res = await request(app)
      .get(`/${PathName.SEARCH}${SEARCH_PARAM}${WRONG_SEARCH}`);
    expect(res.body).toBe(Empty.SEARCH);
  });
});
