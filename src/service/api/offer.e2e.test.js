'use strict';

const express = require(`express`);
const request = require(`supertest`);

const offer = require(`./offer.js`);
const OfferService = require(`../data-service/offer.js`);
const CommentService = require(`../data-service/comment.js`);

const {HttpCode, PathName, Empty} = require(`../constants.js`);
const mocks = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const offerService = new OfferService(fakeDb, fakeSequelize);
const commentService = new CommentService(fakeDb);

const Offer = {
  RIGHT_ID: 1,
  WRONG_ID: encodeURI(`ылдвапр`),
};

const Author = {
  RIGHT_ID: 1,
  WRONG_ID: encodeURI(`jkdcs`),
};

const createAPI = () => {
  const app = express();
  app.use(express.json());
  offer(app, offerService, commentService);
  return app;
};

beforeAll(async () => {
  await initDb(mocks, fakeSequelize);
});

afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});


describe(`When GET '/${PathName.OFFERS}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await offerService.findAll();
    response = await request(app)
      .get(`/${PathName.OFFERS}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to offers from fake database`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.OFFERS}/byAuthorId/${Author.RIGHT_ID}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await offerService.findAllByAuthorId(Author.RIGHT_ID);
    response = await request(app)
      .get(`/${PathName.OFFERS}/byAuthorId/${Author.RIGHT_ID}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to author's articles from database`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.OFFERS}/byAuthorId/${Author.WRONG_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.OFFERS}/byAuthorId/${Author.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to '${Empty.OFFERS}'`, () => {
    expect(response.body).toStrictEqual(Empty.OFFERS);
  });
});


describe(`When GET '/${PathName.OFFERS}/mostDiscussed'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await offerService.findMostDiscussed();
    response = await request(app)
      .get(`/${PathName.OFFERS}/mostDiscussed`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to list of most discussed offers`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.OFFERS}/fresh'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await offerService.findFresh();
    response = await request(app)
      .get(`/${PathName.OFFERS}/fresh`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to most fresh articles`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.OFFERS}/${Offer.RIGHT_ID}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await offerService.findOne(Offer.RIGHT_ID);
    response = await request(app)
      .get(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`);
    result = JSON.parse(JSON.stringify(data));
  });


  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to mock article with id='${Offer.RIGHT_ID}''`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.OFFERS}/${Offer.WRONG_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.OFFERS}/${Offer.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.OFFER}`, () => {
    expect(response.body).toStrictEqual(Empty.OFFER);
  });
});
