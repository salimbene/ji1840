require('dotenv').config();

const debug = require('debug')('app:server'); //Formated & Located debugging
const winston = require('winston');
const morgan = require('morgan');
const config = require('config');
const express = require('express');
const app = express();

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/mongodb')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

//Logging only on development environment
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled');
}

// debug('name', config.get('name'));
// debug('mail.host', config.get('mail.host'));
// debug('mail.password', config.get('mail.password'));

const PORT = config.get('port') || process.env.PORT || 5000;
app.listen(PORT, () => winston.info(`Listening on port ${PORT}...`));
