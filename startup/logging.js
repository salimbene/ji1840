const winston = require('winston');
const config = require('config');
const debug = require('debug')('app:winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  debug('winston init.');
  const db = config.get('db');

  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtException.log' })
  );

  //subscription to process
  process.on('uncaughtRejection', ex => {
    throw ex;
  });

  winston.add(winston.transports.File, {
    filename: 'logfile.log',
    level: 'warn'
  });
  winston.add(winston.transports.MongoDB, { db, level: 'warn' });
};
