'use strict';

const moment = require(`moment`);
const express = require(`express`);
const request = require(`supertest`);

const offer = require(`./offer.js`);
const OfferService = require(`../data-service/offer.js`);
const CommentService = require(`../data-service/comment.js`);
const AuthService = require(`../data-service/auth.js`);

const {HttpCode, PathName, Empty} = require(`../constants.js`);
const mocks = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const offerService = new OfferService(fakeDb, fakeSequelize);
const commentService = new CommentService(fakeDb);
const authService = new AuthService(fakeDb);

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
  offer(app, offerService, commentService, authService);
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


describe(`When POST '/${PathName.OFFERS}'`, () => {
  const app = createAPI();

  let response;

  const mockOffer = {
    [`title`]: `Тестовый заголовок объявления`,
    [`description`]: `Описательная часть объявления`,
    [`category`]: [`1`, `3`, `4`],
    [`sum`]: 2100,
    [`type`]: `Куплю`,
    [`offer_picture`]: `picture.jpg`,
    [`created_date`]: moment(Date.now()).toISOString(),
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.OFFERS}`)
      .send(mockOffer);
  });

  test(`status code should be ${HttpCode.OK}, response should be the same as mockOffer`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toStrictEqual(mockOffer);
  });

});


describe(`When PUT '${PathName.OFFERS}/${Offer.RIGHT_ID}'`, () => {
  const app = createAPI();

  let response;

  const mockOffer = {
    [`title`]: `Тестовый заголовок объявления`,
    [`description`]: `Описательная часть объявления`,
    [`category`]: [`1`, `3`, `4`],
    [`sum`]: 2100,
    [`type`]: `Куплю`,
    [`offer_picture`]: `picture.jpg`,
    [`created_date`]: moment(Date.now()).toISOString(),
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`)
      .send(mockOffer);
  });

  test(`status code should be ${HttpCode.OK}, response should be the same as request object`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toStrictEqual(mockOffer);
  });
});


describe(`When PUT '${PathName.OFFERS}/${Offer.WRONG_ID}'`, () => {
  const app = createAPI();

  let response;

  const mockOffer = {
    [`title`]: `Тестовый заголовок объявления`,
    [`description`]: `Описательная часть объявления`,
    [`category`]: [`1`, `3`, `4`],
    [`sum`]: 2100,
    [`type`]: `Куплю`,
    [`offer_picture`]: `picture.jpg`,
    [`created_date`]: moment(Date.now()).toISOString(),
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.OFFERS}/${Offer.WRONG_ID}`)
      .send(mockOffer);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}, response should be ${Empty.OFFER}`, () => {

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(response.body).toStrictEqual(Empty.OFFER);
  });
});


describe(`When POST '/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments'`, () => {
  const app = createAPI();

  let response;

  const mockComment = {
    text: `Текст нового комментария`,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments`)
      .send(mockComment);
  });

  test(`status code should be ${HttpCode.OK} and response should be the same as mockComment`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toStrictEqual(mockComment);
  });
});


describe(`When POST '/${PathName.OFFERS}/${Offer.WRONG_ID}/comments'`, () => {
  const app = createAPI();

  let response;

  const mockComment = {
    text: `Текст нового комментария`,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.OFFERS}/${Offer.WRONG_ID}/comments`)
      .send(mockComment);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST} and response should be equal to '${Empty.COMMENT}'`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(response.body).toStrictEqual(Empty.COMMENT);
  });
});


describe(`When DELETE '/${PathName.OFFERS}/${Offer.RIGHT_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`);
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });
});


describe(`When DELETE '/${PathName.OFFERS}/${Offer.WRONG_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.OFFERS}/${Offer.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});
