'use strict';

const express = require(`express`);
const request = require(`supertest`);

const comment = require(`./comment.js`);
const {CommentService, UserService, OfferService} = require(`../data-service`);

const {HttpCode, PathName, Empty} = require(`../constants.js`);
const mocks = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const Comment = {
  RIGHT_ID: 1,
  WRONG_ID: 100000,
};

const Offer = {
  RIGHT_ID: 1,
  WRONG_ID: 100000,
};

const User = {
  RIGHT_ID: 1,
  NOT_OWNER: 4,
  WRONG_ID: 10000,
};

const commentService = new CommentService(fakeDb);
const userService = new UserService(fakeDb);
const offerService = new OfferService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  comment(app, commentService, offerService, userService);
  return app;
};

beforeAll(async () => {
  await initDb(mocks, fakeSequelize);
});

afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});


describe(`When GET '/${PathName.COMMENTS}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await commentService.findAll();
    response = await request(app)
      .get(`/${PathName.COMMENTS}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to categories from db`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.COMMENTS}/${Comment.RIGHT_ID}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await commentService.findOne(Comment.RIGHT_ID);
    response = await request(app)
      .get(`/${PathName.COMMENTS}/${Comment.RIGHT_ID}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to comment from database`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.COMMENTS}/${Comment.WRONG_ID}'`, () => {
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
      .get(`/${PathName.COMMENTS}/${Comment.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.NOT_FOUND}`, () => {
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When GET '/${PathName.COMMENTS}/byOfferId/${Offer.RIGHT_ID}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await commentService.findAllByOfferId(Offer.RIGHT_ID);
    response = await request(app)
      .get(`/${PathName.COMMENTS}/byOfferId/${Offer.RIGHT_ID}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to comments from database`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.COMMENTS}/byOfferId/${Offer.WRONG_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.COMMENTS}/byOfferId/${Offer.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to ${Empty.COMMENTS}`, () => {
    expect(response.body).toStrictEqual(Empty.COMMENTS);
  });
});


describe(`When POST valid data '/${PathName.COMMENTS}' in case: User is logged in, offerId and userId are correct`, () => {
  const app = createAPI();

  let response;

  const data = {
    text: `Валидный комментарий длиной более 20 символов`,
    userId: User.RIGHT_ID,
    offerId: Offer.RIGHT_ID,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.COMMENTS}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Response should be 'Comment is created'`, () => {
    expect(response.body).toBe(`Comment is created`);
  });
});


describe(`When POST valid data '/${PathName.COMMENTS}' in case: User is not logged in (userId is null), offerId is correct`, () => {
  const app = createAPI();

  let response;

  const data = {
    text: `Валидный комментарий длиной более 20 символов`,
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
      .post(`/${PathName.COMMENTS}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When POST valid data '/${PathName.COMMENTS}' in case: User is logged in, userId is correct, offerId is null`, () => {
  const app = createAPI();

  let response;

  const data = {
    text: `Валидный комментарий длиной более 20 символов`,
    userId: User.RIGHT_ID,
    offerId: null,
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
      .post(`/${PathName.COMMENTS}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.NOT_FOUND}`, () => {
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When POST invalid data '/${PathName.COMMENTS}' in case: User is logged in, userId and offerId are correct`, () => {
  const app = createAPI();

  let response;

  const data = {
    text: `Новый коммент`,
    userId: User.RIGHT_ID,
    offerId: Offer.RIGHT_ID,
  };

  const expectedReply = {
    data,
    status: HttpCode.BAD_REQUEST,
    errors: [{
      label: `text`,
      message: `Длина должна быть не менее 20 символов`,
    }],
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.COMMENTS}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When DELETE '/${PathName.COMMENTS}' in case: Comment is exist, User is not logged in`, () => {
  const app = createAPI();

  let response;

  const data = {
    userId: null,
    commentId: Comment.RIGHT_ID,
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
      .delete(`/${PathName.COMMENTS}`).send(data);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When DELETE '/${PathName.COMMENTS}' in case: Comment is not exist, User is logged in`, () => {
  const app = createAPI();

  let response;

  const data = {
    userId: User.RIGHT_ID,
    commentId: Comment.WRONG_ID,
  };

  const expectedReply = {
    data,
    status: HttpCode.NOT_FOUND,
    errors: [{
      message: `Комментарий не найден`,
    }],
  };

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.COMMENTS}`).send(data);
  });

  test(`status code should be ${HttpCode.NOT_FOUND}`, () => {
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When DELETE '/${PathName.COMMENTS}' in case: Comment is exist, User is logged in, but User is not an Owner of Offer`, () => {
  const app = createAPI();

  let response;

  const data = {
    userId: User.NOT_OWNER,
    commentId: Comment.RIGHT_ID,
  };

  const expectedReply = {
    data,
    status: HttpCode.FORBIDDEN,
    errors: [{
      message: `Доступ ограничен`,
    }]
  };

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.COMMENTS}`).send(data);
  });

  test(`status code should be ${HttpCode.FORBIDDEN}`, () => {
    expect(response.statusCode).toBe(HttpCode.FORBIDDEN);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When DELETE '/${PathName.COMMENTS}' in case: Comment is exist, User is logged in, and User is an Owner of Offer`, () => {
  const app = createAPI();

  let response;

  const data = {
    userId: User.RIGHT_ID,
    commentId: Comment.RIGHT_ID,
  };

  const expectedReply = `Comment is deleted`;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.COMMENTS}`).send(data);
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});
