'use strict';

const {HttpCode} = require(`../constants`);

module.exports = () => (req, res, next) => {
  const article = res.locals.article;
  const {commentId} = req.params;
  const comment = article.comments.find((item) => item.id === commentId);

  if (!comment) {
    return res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
  }

  return next();
};
