const debug = require('debug')('startup:mongo');
const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
  const DB = config.get('db');
  mongoose.set('useFindAndModify', false);
  mongoose
    .connect(DB, { useNewUrlParser: true })
    .then(() => winston.info('Connected to MongoDB...'));

  debug(`database: ${DB}`);
};
