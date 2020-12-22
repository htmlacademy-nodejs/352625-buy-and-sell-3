'use strict';

const express = require(`express`);
const request = require(`supertest`);

const user = require(`./user.js`);
const {UserService} = require(`../data-service`);

const {PathName, HttpCode} = require(`../constants.js`);
const mocks = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const userService = new UserService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  user(app, userService);
  return app;
};

beforeAll(async () => {
  await initDb(mocks, fakeSequelize);
});

afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});

describe(`When POST valid data '/${PathName.USER}'`, () => {
  const app = createAPI();

  let response;

  const mockUser = {
    [`user-name`]: `Дмитрий Иванов`,
    [`user-email`]: `example@mail.org`,
    [`user-password`]: `123456`,
    [`user-password-again`]: `123456`,
    avatar: `example.jpg`,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.USER}`)
      .send(mockUser);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`response should be 'User is registered'`, () => {
    expect(response.body).toBe(`User is registered`);
  });
});


describe(`When POST valid data '/${PathName.USER}' but email already exist`, () => {
  const app = createAPI();

  let response;

  const mockUser = {
    [`user-name`]: `Антон Маркин`,
    [`user-email`]: `anton_markin@local.com`, // exist in fake database
    [`user-password`]: `123456`,
    [`user-password-again`]: `123456`,
    avatar: `example.jpg`,
  };

  const expectedReply = {
    data: mockUser,
    errors: [{
      label: `user-email`,
      message: `Этот email занят`,
    }],
    status: 400,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.USER}`)
      .send(mockUser);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When POST invalid data '/${PathName.USER}'`, () => {
  const app = createAPI();

  let response;

  const mockUser = {
    [`user-name`]: `Дима Иванов`,
    [`user-email`]: `d_ivanov@local`,
    [`user-password`]: `123456`,
    [`user-password-again`]: `654321`,
    avatar: `example.jpg`,
  };

  const expectedReply = {
    data: mockUser,
    errors: [{
      label: `user-email`,
      message: `Невалидный email`
    }, {
      label: `user-password-again`,
      message: `Пароли не совпали - повторите еще раз`
    }],
    status: 400,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.USER}`)
      .send(mockUser);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});
