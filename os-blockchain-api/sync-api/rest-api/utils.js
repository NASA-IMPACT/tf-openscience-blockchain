var helper = require('./connection.js');

const awaitHandler = (fn) => {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (err) {
        console.log(err);
        next(err);
      }
    };
  };

  module.exports = {
    awaitHandler
  }
