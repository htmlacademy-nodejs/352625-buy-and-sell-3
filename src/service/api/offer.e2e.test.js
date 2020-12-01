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
const {loginByAuthorId, logoutByAuthorId} = require(`./test-utils.js`);

const offerService = new OfferService(fakeDb, fakeSequelize);
const commentService = new CommentService(fakeDb);
const authService = new AuthService(fakeDb);

const Offer = {
  RIGHT_ID: 1,
  WRONG_ID: encodeURI(`ылдвапр`),
  NON_EXIST_ID: encodeURI(`1234567`),
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

  test(`response should be 'Incorrect id`, () => {
    expect(response.body).toStrictEqual(`Incorrect id`);
  });
});


describe(`When GET '/${PathName.OFFERS}/${Offer.NON_EXIST_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.OFFERS}/${Offer.NON_EXIST_ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be 'Data is not exist'`, () => {
    expect(response.body).toBe(`Data is not exist`);
  });
});


describe(`When POST valid data '/${PathName.OFFERS}' in login mode`, () => {
  const app = createAPI();

  let response;

  const mockOffer = {
    [`title`]: `Валидный заголовок объявления`,
    [`description`]: `Описательная часть объявления должна быть не менее 50 символов`,
    [`categories`]: [1, 3, 4],
    [`sum`]: 2100,
    [`type`]: `Куплю`,
    [`offer_picture`]: `picture.jpg`,
  };

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .post(`/${PathName.OFFERS}`)
      .send(mockOffer);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Response should be 'Offer is created'`, () => {
    expect(response.body).toStrictEqual(`Offer is created`);
  });
});


describe(`When POST invalid data '/${PathName.OFFERS}' in login mode`, () => {
  const app = createAPI();

  let response;

  const mockOffer = {
    [`title`]: `Заголовок`,
    [`description`]: `Невалидное описание`,
    [`categories`]: [],
    [`sum`]: 10,
    [`type`]: `Куплю`,
    [`offer_picture`]: `picture.jpg`,
  };

  const expectedReply = {
    data: mockOffer,
    errors: [
      {
        label: `title`,
        message: `Длина должна быть не менее 10 символов`
      },
      {
        label: `description`,
        message: `Длина должна быть не менее 50 символов`
      },
      {
        label: `categories`,
        message: `Выберите хотя бы одну категорию`
      },
      {
        label: `sum`,
        message: `Стоимость должна быть не менее 100`
      }
    ],
    status: HttpCode.BAD_REQUEST
  };


  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .post(`/${PathName.OFFERS}`)
      .send(mockOffer);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response should be consist object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When POST '/${PathName.OFFERS}' in logout mode`, () => {
  const app = createAPI();

  let response;

  const mockOffer = {
    [`title`]: `Тестовый заголовок объявления`,
    [`description`]: `Описательная часть объявления`,
    [`categories`]: [1, 3, 4],
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

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be the 'Unauthorized access'`, () => {
    expect(response.body).toStrictEqual(`Unauthorized access`);
  });
});


describe(`When PUT valid '${PathName.OFFERS}/${Offer.RIGHT_ID} in login mode'`, () => {
  const app = createAPI();

  let response;

  const mockOffer = {
    [`title`]: `Валидный заголовок объявления`,
    [`description`]: `Описательная часть объявления должна быть не менее 50 символов`,
    [`categories`]: [1, 3, 4],
    [`sum`]: 2100,
    [`type`]: `Куплю`,
    [`offer_picture`]: `picture.jpg`,
  };

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .put(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`)
      .send(mockOffer);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Response should be 'Offer is changed'`, () => {
    expect(response.body).toBe(`Offer is changed`);
  });

});


describe(`When PUT invalid '${PathName.OFFERS}/${Offer.RIGHT_ID} in login mode'`, () => {
  const app = createAPI();

  let response;

  const mockOffer = {
    [`title`]: `Заголовок`,
    [`description`]: `Невалидное описание`,
    [`categories`]: [],
    [`sum`]: 10,
    [`type`]: `Куплю`,
    [`offer_picture`]: `picture.jpg`,
  };

  const expectedReply = {
    data: mockOffer,
    errors: [
      {
        label: `title`,
        message: `Длина должна быть не менее 10 символов`
      },
      {
        label: `description`,
        message: `Длина должна быть не менее 50 символов`
      },
      {
        label: `categories`,
        message: `Выберите хотя бы одну категорию`
      },
      {
        label: `sum`,
        message: `Стоимость должна быть не менее 100`
      }
    ],
    status: HttpCode.BAD_REQUEST
  };

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .put(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`)
      .send(mockOffer);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response should be the object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });

});


describe(`When PUT '${PathName.OFFERS}/${Offer.RIGHT_ID} in logout mode'`, () => {
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

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be 'Unauthorized access'`, () => {
    expect(response.body).toBe(`Unauthorized access`);
  });

});


describe(`When PUT '${PathName.OFFERS}/${Offer.WRONG_ID} in login mode'`, () => {
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
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .put(`/${PathName.OFFERS}/${Offer.WRONG_ID}`)
      .send(mockOffer);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response should be 'Incorrect id'`, () => {
    expect(response.body).toStrictEqual(`Incorrect id`);
  });
});


describe(`When PUT '${PathName.OFFERS}/${Offer.WRONG_ID} in logout mode'`, () => {
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

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be 'Unauthorized access'`, () => {
    expect(response.body).toStrictEqual(`Unauthorized access`);
  });
});


describe(`When PUT '${PathName.OFFERS}/${Offer.NON_EXIST_ID} in login mode'`, () => {
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
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .put(`/${PathName.OFFERS}/${Offer.NON_EXIST_ID}`)
      .send(mockOffer);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response should be 'Data is not exist'`, () => {
    expect(response.body).toBe(`Data is not exist`);
  });

});


describe(`When PUT '${PathName.OFFERS}/${Offer.NON_EXIST_ID} in logout mode'`, () => {
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
      .put(`/${PathName.OFFERS}/${Offer.NON_EXIST_ID}`)
      .send(mockOffer);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be 'Unauthorized access'`, () => {
    expect(response.body).toBe(`Unauthorized access`);
  });
});


describe(`When POST '/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments' in login mode`, () => {
  const app = createAPI();

  let response;

  const mockComment = {
    text: `Текст нового комментария`,
  };

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .post(`/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments`)
      .send(mockComment);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Response should be 'Comment is created'`, () => {
    expect(response.body).toBe(`Comment is created`);
  });

});


describe(`When POST '/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments' in logout mode`, () => {
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

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be the 'Unauthorized access'`, () => {
    expect(response.body).toStrictEqual(`Unauthorized access`);
  });
});


describe(`When POST '/${PathName.OFFERS}/${Offer.WRONG_ID}/comments' in login mode`, () => {
  const app = createAPI();

  let response;

  const mockComment = {
    text: `Текст нового комментария`,
  };

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .post(`/${PathName.OFFERS}/${Offer.WRONG_ID}/comments`)
      .send(mockComment);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response should be 'Incorrect id'`, () => {
    expect(response.body).toStrictEqual(`Incorrect id`);
  });

});


describe(`When POST '/${PathName.OFFERS}/${Offer.WRONG_ID}/comments' in logout mode`, () => {
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

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be 'Incorrect id'`, () => {
    expect(response.body).toStrictEqual(`Unauthorized access`);
  });
});


describe(`When POST '/${PathName.OFFERS}/${Offer.NON_EXIST_ID}/comments' in login mode`, () => {
  const app = createAPI();

  let response;

  const mockComment = {
    text: `Текст нового комментария`,
  };

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .post(`/${PathName.OFFERS}/${Offer.NON_EXIST_ID}/comments`)
      .send(mockComment);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response should be 'Data is not exist'`, () => {
    expect(response.body).toStrictEqual(`Data is not exist`);
  });
});


describe(`When POST '/${PathName.OFFERS}/${Offer.NON_EXIST_ID}/comments' in logout mode`, () => {
  const app = createAPI();

  let response;

  const mockComment = {
    text: `Текст нового комментария`,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.OFFERS}/${Offer.NON_EXIST_ID}/comments`)
      .send(mockComment);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be 'Unauthorized access'`, () => {
    expect(response.body).toStrictEqual(`Unauthorized access`);
  });
});


describe(`When DELETE '/${PathName.OFFERS}/${Offer.RIGHT_ID}' in logout mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be 'Unauthorized access'`, () => {
    expect(response.body).toStrictEqual(`Unauthorized access`);
  });
});


describe(`When DELETE '/${PathName.OFFERS}/${Offer.RIGHT_ID}' in login mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .delete(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Response should be 'Offer is deleted'`, () => {
    expect(response.body).toStrictEqual(`Offer is deleted`);
  });
});


describe(`When DELETE '/${PathName.OFFERS}/${Offer.WRONG_ID}' in login mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .delete(`/${PathName.OFFERS}/${Offer.WRONG_ID}`);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response should be 'Incorrect id'`, () => {
    expect(response.body).toStrictEqual(`Incorrect id`);
  });
});


describe(`When DELETE '/${PathName.OFFERS}/${Offer.WRONG_ID}' in logout mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.OFFERS}/${Offer.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be 'Unauthorized access'`, () => {
    expect(response.body).toStrictEqual(`Unauthorized access`);
  });
});


describe(`When DELETE '/${PathName.OFFERS}/${Offer.NON_EXIST_ID}' in login mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .delete(`/${PathName.OFFERS}/${Offer.NON_EXIST_ID}`);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response should be 'Data is not exist'`, () => {
    expect(response.body).toStrictEqual(`Data is not exist`);
  });
});


describe(`When DELETE '/${PathName.OFFERS}/${Offer.NON_EXIST_ID}' in logout mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.OFFERS}/${Offer.NON_EXIST_ID}`);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be 'Unauthorized access'`, () => {
    expect(response.body).toStrictEqual(`Unauthorized access`);
  });
});
