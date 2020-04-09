'use strict';

const request = require(`supertest`);

const {app} = require(`./../cli/server.js`);
const {PathName, Empty} = require(`./../routes/constants.js`);

const StatusCode = {
  OK: 200,
  BAD: 400,
};

const Offer = {
  RIGHT_ID: encodeURI(`q1g2AR`),
  WRONG_ID: encodeURI(`ылдвапр`),
};

const Comment = {
  RIGHT_ID: encodeURI(`ti61`),
  WRONG_ID: encodeURI(`фжыдвл`),
};

describe(`When GET '/${PathName.OFFERS}'`, () => {
  test(`status code should be ${StatusCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}`);
    expect(res.statusCode).toBe(StatusCode.OK);
  });

  test(`response should be an array of objects`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}`);
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
});

describe(`When GET '/${PathName.OFFERS}/${Offer.RIGHT_ID}'`, () => {
  test(`status code should be ${StatusCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`);
    expect(res.statusCode).toBe(StatusCode.OK);
  });

  test(`response should be an object with exact structure`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`);

    expect(typeof res.body).toBe(`object`);
    expect(res.body).toHaveProperty(`id`);
    expect(res.body).toHaveProperty(`category`);
    expect(res.body).toHaveProperty(`description`);
    expect(res.body).toHaveProperty(`picture`);
    expect(res.body).toHaveProperty(`title`);
    expect(res.body).toHaveProperty(`type`);
    expect(res.body).toHaveProperty(`sum`);
    expect(res.body).toHaveProperty(`comments`);
  });
});

describe(`When GET '/${PathName.OFFERS}/${Offer.WRONG_ID}'`, () => {
  test(`status code should be ${StatusCode.BAD}`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.WRONG_ID}`);
    expect(res.statusCode).toBe(StatusCode.BAD);
  });

  test(`response should be a blank object`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.WRONG_ID}`);
    expect(typeof res.body).toBe(`object`);
  });
});

describe(`When GET '/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments'`, () => {
  test(`status code should be ${StatusCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments`);
    expect(res.statusCode).toBe(StatusCode.OK);
  });

  test(`response should be an array of objects`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments`);
    expect(typeof res.body).toBe(`object`);

    for (let item of res.body) {
      expect(typeof item).toBe(`object`);
      expect(item).toHaveProperty(`id`);
      expect(item).toHaveProperty(`text`);
    }
  });
});

describe(`When GET '/${PathName.OFFERS}/${Offer.WRONG_ID}/comments'`, () => {
  test(`status code should be ${StatusCode.BAD}`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.WRONG_ID}/comments`);
    expect(res.statusCode).toBe(StatusCode.BAD);
  });

  test(`response should be a blank array`, async () => {
    const res = await request(app).get(`/${PathName.OFFERS}/${Offer.WRONG_ID}/comments`);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});

describe(`When POST '/${PathName.OFFERS}'`, () => {
  const mockOffer = {title: `text`, sum: `123456`};

  test(`status code should be ${StatusCode.OK}`, async () => {
    const res = await request(app)
      .post(`/${PathName.OFFERS}`)
      .send(mockOffer);
    expect(res.statusCode).toBe(StatusCode.OK);
    expect(res.body).toStrictEqual(mockOffer);
  });
});

describe(`When PUT '/${PathName.OFFERS}/${Offer.RIGHT_ID}'`, () => {
  const mockOffer = {title: `text`, sum: `123456`};

  test(`status code should be ${StatusCode.OK}`, async () => {
    const res = await request(app)
      .put(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`)
      .send(mockOffer);

    expect(res.statusCode).toBe(StatusCode.OK);
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

  test(`status code should be ${StatusCode.BAD}`, async () => {
    const res = await request(app)
      .put(`/${PathName.OFFERS}/${Offer.WRONG_ID}`)
      .send(mockOffer);

    expect(res.statusCode).toBe(StatusCode.BAD);
  });

  test(`response should be empty object`, async () => {
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

    expect(res.statusCode).toBe(StatusCode.OK);
    expect(res.body).toStrictEqual(mockComment);
  });

  test(`if ID is wrong status code should be 400 and response should be empty object`, async () => {
    const res = await request(app)
      .put(`/${PathName.OFFERS}/${Offer.WRONG_ID}/comments`)
      .send(mockComment);

    expect(res.statusCode).toBe(StatusCode.BAD);
    expect(res.body).toStrictEqual(Empty.COMMENT);
  });
});

describe(`When DELETE '/${PathName.OFFERS}/${Offer.RIGHT_ID}'`, () => {
  test(`status code should be ${StatusCode.OK}`, async () => {
    const res = await request(app).delete(`/${PathName.OFFERS}/${Offer.RIGHT_ID}`);
    expect(res.statusCode).toBe(StatusCode.OK);
  });
});

describe(`When DELETE '/${PathName.OFFERS}/${Offer.WRONG_ID}'`, () => {
  test(`status code should be ${StatusCode.BAD}`, async () => {
    const res = await request(app).delete(`/${PathName.OFFERS}/${Offer.WRONG_ID}`);
    expect(res.statusCode).toBe(StatusCode.BAD);
  });
});

describe(`When DELETE '/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments/${Comment.RIGHT_ID}'`, () => {
  test(`status code should be ${StatusCode.OK}`, async () => {
    const res = await request(app).delete(`/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments/${Comment.RIGHT_ID}`);
    expect(res.statusCode).toBe(StatusCode.OK);
  });
});

describe(`When DELETE '/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments/${Comment.WRONG_ID}'`, () => {
  test(`status code should be ${StatusCode.OK}`, async () => {
    const res = await request(app).delete(`/${PathName.OFFERS}/${Offer.RIGHT_ID}/comments/${Comment.WRONG_ID}`);
    expect(res.statusCode).toBe(StatusCode.BAD);
  });
});

describe(`When DELETE '/${PathName.OFFERS}/${Offer.WRONG_ID}/comments/${Comment.WRONG_ID}'`, () => {
  test(`status code should be ${StatusCode.BAD}`, async () => {
    const res = await request(app).delete(`/${PathName.OFFERS}/${Offer.WRONG_ID}/comments/${Comment.WRONG_ID}`);
    expect(res.statusCode).toBe(StatusCode.BAD);
  });
});
