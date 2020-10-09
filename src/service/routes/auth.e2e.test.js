'use strict';

const request = require(`supertest`);

const {app} = require(`./../cli/server.js`);
const {PathName} = require(`./../routes/constants.js`);
const {HttpCode} = require(`./../cli/constants.js`);

describe.skip(`When GET '/${PathName.AUTH}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.AUTH}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should consist object with special structure`, async () => {
    const res = await request(app).get(`/${PathName.AUTH}`);

    const mockAuth = [];

    expect(res.body).toStrictEqual(mockAuth);
  });
});
