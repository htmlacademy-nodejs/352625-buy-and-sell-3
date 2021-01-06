'use strict';

const express = require(`express`);
const request = require(`supertest`);

const offer = require(`./offer.js`);
const {OfferService, CommentService, UserService} = require(`../data-service`);

const {HttpCode, PathName, Empty} = require(`../constants.js`);
const mocks = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const offerService = new OfferService(fakeDb, fakeSequelize);
const commentService = new CommentService(fakeDb);
const userService = new UserService(fakeDb);

const Offer = {
  RIGHT_ID: 1,
  WRONG_ID: 10000,
  NON_EXIST_ID: encodeURI(`1234567`),
};

const Author = {
  RIGHT_ID: 1,
  NOT_OWNER: 4,
  WRONG_ID: encodeURI(`jkdcs`),
};

const createAPI = () => {
  const app = express();
  app.use(express.json());
  offer(app, offerService, commentService, userService);
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

  const expectedReply = {
    data: {},
    status: HttpCode.NOT_FOUND,
    errors: [{
      message: `Данные не найдены`,
    }],
  };

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.OFFERS}/${Offer.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.NOT_FOUND}`, () => {
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When POST valid data '/${PathName.OFFERS}' in case: User is logged in`, () => {
  const app = createAPI();

  let response;

  const data = {
    title: `Валидный заголовок объявления`,
    description: `Описательная часть объявления должна быть не менее 50 символов`,
    categories: [1, 3, 4],
    sum: 2100,
    type: `Куплю`,
    offerPicture: `picture.jpg`,
    userId: Author.RIGHT_ID,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.OFFERS}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Response should be 'Offer is created'`, () => {
    expect(response.body).toStrictEqual(`Offer is created`);
  });
});


describe(`When POST valid data '/${PathName.OFFERS}' in case: User is not logged in`, () => {
  const app = createAPI();

  let response;

  const data = {
    title: `Валидный заголовок объявления`,
    description: `Описательная часть объявления должна быть не менее 50 символов`,
    categories: [1, 3, 4],
    sum: 2100,
    type: `Куплю`,
    offerPicture: `picture.jpg`,
    userId: null,
  };

  const expectedReply = {
    data,
    status: HttpCode.UNAUTHORIZED,
    errors: [{
      message: `Такого пользователя не существует`
    }],
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.OFFERS}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When POST invalid data '/${PathName.OFFERS}' in case: User is logged in`, () => {
  const app = createAPI();

  let response;

  const data = {
    title: `Заголовок`,
    description: `Невалидное описание`,
    categories: [],
    sum: 10,
    type: `Куплю`,
    offerPicture: `picture.jpg`,
    userId: Author.RIGHT_ID,
  };

  const expectedReply = {
    data,
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
    response = await request(app)
      .post(`/${PathName.OFFERS}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When PUT valid data '${PathName.OFFERS} in case: User is logged in and User is an Owner, Offer is exist'`, () => {
  const app = createAPI();

  let response;

  const data = {
    title: `Валидный заголовок объявления`,
    description: `Описательная часть объявления должна быть не менее 50 символов`,
    categories: [1, 3, 4],
    sum: 2100,
    type: `Куплю`,
    offerPicture: `picture.jpg`,
    offerId: Offer.RIGHT_ID,
    userId: Author.RIGHT_ID,
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.OFFERS}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Response should be 'Offer is changed'`, () => {
    expect(response.body).toBe(`Offer is changed`);
  });

});


describe(`When PUT valid data '${PathName.OFFERS} in case: User is logged in and User is an Owner, Offer is not exist'`, () => {
  const app = createAPI();

  let response;

  const data = {
    title: `Валидный заголовок объявления`,
    description: `Описательная часть объявления должна быть не менее 50 символов`,
    categories: [1, 3, 4],
    sum: 2100,
    type: `Куплю`,
    offerPicture: `picture.jpg`,
    offerId: null,
    userId: Author.RIGHT_ID,
  };

  const expectedReply = {
    data,
    status: HttpCode.NOT_FOUND,
    errors: [{
      message: `Запись не найдена`,
    }],
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.OFFERS}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.NOT_FOUND}`, () => {
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });

});


describe(`When PUT valid data '${PathName.OFFERS} in case: User is logged in, Offer's id is incorrect'`, () => {
  const app = createAPI();

  let response;

  const data = {
    title: `Валидный заголовок объявления`,
    description: `Описательная часть объявления должна быть не менее 50 символов`,
    categories: [1, 3, 4],
    sum: 2100,
    type: `Куплю`,
    offerPicture: `picture.jpg`,
    offerId: Offer.WRONG_ID,
    userId: Author.RIGHT_ID,
  };

  const expectedReply = {
    data,
    status: HttpCode.NOT_FOUND,
    errors: [{
      message: `Запись не найдена`,
    }],
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.OFFERS}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.NOT_FOUND}`, () => {
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });

});


describe(`When PUT valid data '${PathName.OFFERS} in case: User is not logged in, Offer is exist'`, () => {
  const app = createAPI();

  let response;

  const data = {
    title: `Валидный заголовок объявления`,
    description: `Описательная часть объявления должна быть не менее 50 символов`,
    categories: [1, 3, 4],
    sum: 2100,
    type: `Куплю`,
    offerPicture: `picture.jpg`,
    offerId: Offer.RIGHT_ID,
    userId: null,
  };

  const expectedReply = {
    data,
    status: HttpCode.UNAUTHORIZED,
    errors: [{
      message: `Такого пользователя не существует`,
    }],
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.OFFERS}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });

});


describe(`When PUT valid data '${PathName.OFFERS} in case: User is logged in but User is not an Owner, Offer is exist'`, () => {
  const app = createAPI();

  let response;

  const data = {
    title: `Валидный заголовок объявления`,
    description: `Описательная часть объявления должна быть не менее 50 символов`,
    categories: [1, 3, 4],
    sum: 2100,
    type: `Куплю`,
    offerPicture: `picture.jpg`,
    offerId: Offer.RIGHT_ID,
    userId: Author.NOT_OWNER,
  };

  const expectedReply = {
    data,
    status: HttpCode.FORBIDDEN,
    errors: [{
      message: `Доступ ограничен`,
    }],
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.OFFERS}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.FORBIDDEN}`, () => {
    expect(response.statusCode).toBe(HttpCode.FORBIDDEN);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });

});


describe(`When DELETE '/${PathName.OFFERS}' in case: Offer is exist, User is not logged in`, () => {
  const app = createAPI();

  let response;

  const data = {
    userId: null,
    offerId: Offer.RIGHT_ID,
  };

  const expectedReply = {
    data,
    status: HttpCode.UNAUTHORIZED,
    errors: [{
      message: `Такого пользователя не существует`,
    }],
  };

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.OFFERS}`).send(data);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When DELETE '/${PathName.OFFERS}' in case: Offer is exist, User is logged in but User is not an Owner`, () => {
  const app = createAPI();

  let response;

  const data = {
    userId: Author.NOT_OWNER,
    offerId: Offer.RIGHT_ID,
  };

  const expectedReply = {
    data,
    status: HttpCode.FORBIDDEN,
    errors: [{
      message: `Доступ ограничен`,
    }],
  };

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.OFFERS}`).send(data);
  });

  test(`status code should be ${HttpCode.FORBIDDEN}`, () => {
    expect(response.statusCode).toBe(HttpCode.FORBIDDEN);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When DELETE '/${PathName.OFFERS}' in case: Offer is exist, User is logged in and User is an Owner`, () => {
  const app = createAPI();

  let response;

  const data = {
    userId: Author.RIGHT_ID,
    offerId: Offer.RIGHT_ID,
  };

  const expectedReply = `Offer is deleted`;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.OFFERS}`).send(data);
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Response should be 'Offer is deleted'`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When DELETE '/${PathName.OFFERS}' in case: Offer is not exist, User is logged in`, () => {
  const app = createAPI();

  let response;

  const data = {
    userId: Author.RIGHT_ID,
    offerId: Offer.WRONG_ID,
  };

  const expectedReply = {
    data,
    status: HttpCode.NOT_FOUND,
    errors: [{
      message: `Запись не найдена`,
    }],
  };

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.OFFERS}`).send(data);
  });

  test(`status code should be ${HttpCode.NOT_FOUND}`, () => {
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});
