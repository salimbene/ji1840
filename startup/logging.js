const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  console.log('***winstonooooooooooooo***');
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtException.log' })
  );

  //subscription to process
  process.on('uncaughtRejection', ex => {
    throw ex;
  });

  winston.add(winston.transports.File, { filename: 'logfile.log' });
  winston.add(winston.transports.MongoDB, {
    db: 'mongodb://localhost/jitests',
    level: 'error'
  });
};
