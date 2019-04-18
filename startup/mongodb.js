const debug = require('debug')('startup:mongo');
const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
  const DB = config.get('db');
  //disable deprecation warnings
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
  //connect

  const options = {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    useNewUrlParser: true
  };

  mongoose
    .connect(DB, options)
    .then(() => winston.info('Connected to MongoDB...'));

  debug(`database: ${DB}`);
};
