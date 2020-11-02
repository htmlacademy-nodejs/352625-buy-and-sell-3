'use strict';

const {CommandsNames} = require(`./constants.js`);

const chalk = require(`chalk`);

const message = `
    Программа запускает http-сервер и формирует файл с данными для API.

    Гайд:
    server <command>
    
    Команды:
    ${CommandsNames.VERSION}             выводит номер версии
    ${CommandsNames.HELP}                печатает этот текст
    ${CommandsNames.SERVER} <port>       запускает dev-сервер
    ${CommandsNames.DB_CONNECT}          устанавливает соединение с базой данных
    ${CommandsNames.FILL_DB} <count>      наполняет базу данных моками
    `;

module.exports = {
  name: CommandsNames.HELP,
  run() {
    console.info(chalk.gray(message));
  }
};
