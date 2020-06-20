'use strict';

const request = require(`supertest`);

const {app} = require(`./../cli/server.js`);
const {PathName, Empty} = require(`./../routes/constants.js`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const {FILE_NAME, HttpCode} = require(`./../cli/constants.js`);

const readFile = promisify(fs.readFile);

const Offer = {
  RIGHT_ID: encodeURI(`hcpeeb`),
  WRONG_ID: encodeURI(`ылдвапр`),
};

const Comment = {
  RIGHT_ID: encodeURI(`xI0B`),
  WRONG_ID: encodeURI(`фжыдвл`),
};

describe(`When GET '/${PathName.OFFERS}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to mock offers from '${FILE_NAME}'`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}`);
    const mockOffers = JSON.parse(await readFile(FILE_NAME));
    expect(res.body).toStrictEqual(mockOffers);
  });
});

describe(`When GET '/${PathName.OFFERS}/${Offer.RIGHT_ID}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to mock offer with id='${Offer.RIGHT_ID}''`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`);
    const mockOffer = JSON.parse(await readFile(FILE_NAME))
      .filter((elem) => elem.id === Offer.RIGHT_ID)[0];

    expect(res.body).toStrictEqual(mockOffer);
  });
});

describe(`When GET '/${PathName.OFFERS}/${Offer.WRONG_ID}'`, () => {
  test(`status code should be ${HttpCode.NOT_FOUND}`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.WRONG_ID}`);
    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`response should be equal to ${Empty.OFFER}`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.WRONG_ID}`);
    expect(res.body).toStrictEqual(Empty.OFFER);
  });
});

describe(`When GET '/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to comments from '${FILE_NAME}'`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments`);
    const mockComments = JSON.parse(await readFile(FILE_NAME))
      .filter((elem) => elem.id === Offer.RIGHT_ID)[0].comments;

    expect(res.body).toStrictEqual(mockComments);

  });
});

describe(`When GET '/${PathName.OFFERS}/${Offer.WRONG_ID}/comments'`, () => {
  test(`status code should be ${HttpCode.BAD_REQUEST}`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.WRONG_ID}/comments`);
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be be equal to '${Empty.COMMENTS}'`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.WRONG_ID}/comments`);
    expect(res.body).toStrictEqual(Empty.COMMENTS);
  });
});

describe(`When POST '/${PathName.OFFERS}'`, () => {
  const mockOffer = {title: `text`, sum: `123456`};

  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app)
      .post(`/${PathName.OFFERS}`)
      .send(mockOffer);
    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body).toStrictEqual(mockOffer);
  });
});

describe(`When PUT '/${PathName.OFFERS}/${Offer.RIGHT_ID}'`, () => {
  const mockOffer = {title: `text`, sum: `123456`};

  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app)
      .put(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`)
      .send(mockOffer);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be the same as request object`, async () => {
    const res = await request(app)
      .put(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`)
      .send(mockOffer);

    expect(res.body).toStrictEqual(mockOffer);
  });
});

describe(`When PUT '/${PathName.OFFERS}/${Offer.WRONG_ID}'`, () => {
  const mockOffer = {title: `text`, sum: `123456`};

  test(`status code should be ${HttpCode.BAD_REQUEST}`, async () => {
    const res = await request(app)
      .put(`/${PathName.OFFERS}/${Offer.WRONG_ID}`)
      .send(mockOffer);

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to '${Empty.OFFER}'`, async () => {
    const res = await request(app)
      .put(`/${PathName.OFFERS}/${Offer.WRONG_ID}`)
      .send(mockOffer);

    expect(res.body).toStrictEqual(Empty.OFFER);
  });
});

describe(`When PUT '/${PathName.OFFERS}/:ID/comments'`, () => {
  const mockComment = {id: `id01`, text: `some comment text`};

  test(`if ID is correct status code should be 200 and response should be the same as request object`, async () => {
    const res = await request(app)
      .put(`/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments`)
      .send(mockComment);

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body).toStrictEqual(mockComment);
  });

  test(`if ID is wrong status code should be 400 and response should be equal to '${Empty.COMMENT}'`, async () => {
    const res = await request(app)
      .put(`/${PathName.OFFERS}/${Offer.WRONG_ID}/comments`)
      .send(mockComment);

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(res.body).toStrictEqual(Empty.COMMENT);
  });
});

describe(`When DELETE '/${PathName.OFFERS}/${Offer.RIGHT_ID}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).delete(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });
});

describe(`When DELETE '/${PathName.OFFERS}/${Offer.WRONG_ID}'`, () => {
  test(`status code should be ${HttpCode.BAD_REQUEST}`, async () => {
    const res = await request(app).delete(`/${PathName.OFFERS}/${Offer.WRONG_ID}`);
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});

describe(`When DELETE '/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments/${Comment.RIGHT_ID}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).delete(`/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments/${Comment.RIGHT_ID}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });
});

describe(`When DELETE '/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments/${Comment.WRONG_ID}'`, () => {
  test(`status code should be ${HttpCode.BAD_REQUEST}`, async () => {
    const res = await request(app).delete(`/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments/${Comment.WRONG_ID}`);
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});

describe(`When DELETE '/${PathName.OFFERS}/${Offer.WRONG_ID}/comments/${Comment.WRONG_ID}'`, () => {
  test(`status code should be ${HttpCode.BAD_REQUEST}`, async () => {
    const res = await request(app).delete(`/${PathName.OFFERS}/${Offer.WRONG_ID}/comments/${Comment.WRONG_ID}`);
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});