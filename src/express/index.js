'use strict';

const express = require(`express`);
const app = express();

const {DEFAULT_PORT} = require(`./../service/cli/constants.js`);
const PathName = require(`./routes/constants.js`);

const registerRouter = require(`./routes/register.js`);
const loginRouter = require(`./routes/login.js`);
const searchRouter = require(`./routes/search.js`);
const offersRouter = require(`./routes/offers.js`);
const myRouter = require(`./routes/my.js`);

app.get(`/`, (req, res) => res.send(`/`));

app.use(`/${PathName.REGISTER}`, registerRouter);
app.use(`/${PathName.LOGIN}`, loginRouter);
app.use(`/${PathName.SEARCH}`, searchRouter);
app.use(`/${PathName.OFFERS}`, offersRouter);
app.use(`/${PathName.MY}`, myRouter);

app.listen(
    DEFAULT_PORT,
    () => console.log(`Сервер запущен на порту: ${DEFAULT_PORT}`)
);
