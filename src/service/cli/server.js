'use strict';

const chalk = require(`chalk`);
const express = require(`express`);

const {
  CommandsNames,
  DEFAULT_PORT,
} = require(`./constants.js`);

const homeRouter = require(`./../routes/home.js`);

const app = express();
app.use(`/`, homeRouter);
app.set(`json spaces`, 2);


// [ВОПРОС]
// Не понял в задании #17: "3. Подключите middleware для обработки JSON."
// Нагуглил что middleware вот так подключается:
//
// app.use(express.json());
//
// Но куда эту эту строчку добавить - не разобрался.
// А также не понял что должно делать JSON-middleware.
// Ведь в моем случае res.json(...) уже отдает данные в нужном формате.


module.exports = {
  name: CommandsNames.SERVER,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(
        port,
        () => console.log(chalk.green(`Сервер запущен на порту: ${port}`))
    );
  }
};
