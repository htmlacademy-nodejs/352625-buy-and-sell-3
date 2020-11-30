'use strict';

const {db} = require(`./../../data/db`);
const {Empty} = require(`../constants.js`);


class AuthService {
  constructor(database = db) {
    this._database = database;
  }

  async get() {
    let result = await this._database.Auth.findOne({
      where: {
        [`is_auth`]: true
      },
      attributes: [[`is_auth`, `status`]],
      include: {
        model: this._database.Author,
        as: `user`,
        attributes: [`id`, `firstname`, `lastname`],
        include: {
          model: this._database.Picture,
          as: `avatar`
        }
      },
    });

    if (!result) {
      result = Empty.AUTH;
    }

    return result;
  }
}

module.exports = AuthService;
