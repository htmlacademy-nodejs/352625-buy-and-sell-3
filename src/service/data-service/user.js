'use strict';

const {db} = require(`./../../data/db`);
const bcrypt = require(`bcrypt`);
const saltRounds = 10;

const getFirstAndLastName = (userName) => userName.trim().split(` `);

class UserService {
  constructor(database = db) {
    this._database = database;
  }

  async findOneByEmail(email) {
    return await this._database.Author.findOne({where: {email}});
  }

  async add(formData) {
    const picture = await this._database.Picture.create({
      type: `avatar`,
      normal: formData[`avatar`] === `` ? null : formData[`avatar`],
      double: formData[`avatar`] === `` ? null : formData[`avatar`],
    });

    const [firstname, lastname] = getFirstAndLastName(formData[`user-name`]);

    const user = await this._database.Author.create({
      firstname,
      lastname,
      email: formData[`user-email`],
      password: await bcrypt.hash(formData[`user-password`], saltRounds),
      [`picture_id`]: picture[`id`],
    });

    await this._database.Auth.create({
      [`is_auth`]: false,
      [`author_id`]: user[`id`],
    });

    return user;
  }

  async checkUser(user, formData) {
    return await bcrypt.compare(formData[`password`], user[`password`]);
  }

  async login(user) {
    await this._database.Auth.update({[`is_auth`]: false}, {where: {[`is_auth`]: true}});

    const auth = await this._database.Auth.findOne({
      where: {
        [`author_id`]: user[`id`]
      }
    });
    auth[`is_auth`] = true;
    await auth.save();
  }

  async logout() {
    await this._database.Auth.update({[`is_auth`]: false}, {where: {[`is_auth`]: true}});
  }
}

module.exports = UserService;
