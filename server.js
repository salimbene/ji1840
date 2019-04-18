require('dotenv').config();

const debug = require('debug')('app:server');
const winston = require('winston');
const { format } = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')(winston);
require('./startup/routes')(app);
require('./startup/mongodb')();
require('./startup/config')();
require('./startup/validation')();

debug(`environment: ${app.get('env')}`);

//Logging only on development environment
if (app.get('env') === 'development') {
  const morgan = require('morgan');
  app.use(morgan('tiny'));
  debug('morgan enabled');
} else {
  require('./startup/prod')(app);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => winston.info(`Listening on port ${PORT}...`));
