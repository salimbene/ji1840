//const debug = require('debug')('app:mongo');
const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
  const TEST_DB = 'jitests';

  mongoose
    .connect(
      `mongodb://localhost/${TEST_DB}`,
      { useNewUrlParser: true }
    )
    .then(() => winston.info('Connected to MongoDB...'));
};
