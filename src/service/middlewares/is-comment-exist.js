'use strict';

const {HttpCode} = require(`./../constants.js`);
const {ErrorMessages} = require(`../schemas/constants.js`);

module.exports = (commentService) => (
  async (req, res, next) => {
    const comment = await commentService.findOne(req.body[`commentId`]);

    if (!comment) {
      res.status(HttpCode.NOT_FOUND).json({
        status: HttpCode.NOT_FOUND,
        data: req.body,
        errors: [{
          message: ErrorMessages.COMMENT_NOT_FOUND,
        }],
      });
      return;
    }

    next();
  }
);
