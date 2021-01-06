'use strict';

const {db} = require(`./../../data/db`);
const bcrypt = require(`bcrypt`);
const saltRounds = 10;

const getFirstAndLastName = (userName) => userName.trim().split(` `);

class UserService {
  constructor(database = db) {
    this._database = database;
  }

  async isUser(userId) {
    const user = await this._database.Author.findByPk(userId);
    return !!user;
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

    return await this._database.Author.create({
      firstname,
      lastname,
      email: formData[`user-email`],
      password: await bcrypt.hash(formData[`user-password`], saltRounds),
      [`picture_id`]: picture[`id`],
    });
  }

  async checkUser(user, formData) {
    return await bcrypt.compare(formData[`password`], user[`password`]);
  }

  async getAuth(email) {
    return {
      status: true,
      user: await this._database.Author.findOne({
        where: {
          email
        },
        attributes: [`id`, `firstname`, `lastname`],

        include: {
          model: this._database.Picture,
          as: `avatar`,
        }
      })
    };
  }
}

module.exports = UserService;
