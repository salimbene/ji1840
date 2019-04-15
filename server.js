require('dotenv').config();

const serveStatic = require('serve-static');
const path = require('path');
const cwd = process.cwd();

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

debug(path.join(cwd, 'build'));
// Serve static revved files with uncoditional cache
app.use(
  serveStatic(path.join(cwd, 'build'), {
    index: false,
    setHeaders: (res, path) => {
      res.setHeader('Cache-Control', 'public, immutable, max-age=31536000');
    }
  })
);

// Route any non API and non static file to React Client Router for SPA development
app.use((req, res) => {
  debug('sendFile', path.join(cwd, 'build', 'index.html'));
  res.sendFile(path.join(cwd, 'build', 'index.html'));
});

// debug('name', config.get('name'));
// debug('mail.host', config.get('mail.host'));
// debug('mail.password', config.get('mail.password'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => winston.info(`Listening on port ${PORT}...`));
