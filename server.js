require('dotenv').config();

const helmet = require('helmet'); //Secure HTTP headers
const morgan = require('morgan'); //Logging HTTP requests
const debug = require('debug')('app:server'); //Formated & Located debugging
const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/mongodb')();
require('./startup/config')();
require('./startup/validation')();

//Logging only on development environment
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled');
}

// debug('name', config.get('name'));
// debug('mail.host', config.get('mail.host'));
// debug('mail.password', config.get('mail.password'));

app.use(helmet());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => winston.info(`Listening on port ${PORT}...`));
