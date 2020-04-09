'use strict';

const request = require(`supertest`);

const {app} = require(`./../cli/server.js`);
const {PathName} = require(`./../routes/constants.js`);

describe(`When GET '/${PathName.CATEGORIES}'`, () => {
  test(`status code should be 200`, async () => {
    const res = await request(app).get(`/${PathName.CATEGORIES}`);
    expect(res.statusCode).toBe(200);
  });

  test(`response should be an array of strings`, async () => {
    const res = await request(app).get(`/${PathName.CATEGORIES}`);
    expect(Array.isArray(res.body)).toBeTruthy();

    for (let item of res.body) {
      expect(typeof item).toBe(`string`);
    }
  });
});
