require('express-async-errors');
require('dotenv').config();
const helmet = require('helmet'); //Secure HTTP headers
const morgan = require('morgan'); //Logging HTTP requests
const config = require('config'); //Handle config settings
const debug = require('debug')('app:server'); //Formated & Located debugging
const debugM = require('debug')('app:mongo');

const fUnits = require('./routes/funits');
const expenses = require('./routes/expenses');
const consortia = require('./routes/consortia');
const users = require('./routes/users');
const home = require('./routes/home');
const auth = require('./routes/auth');

const error = require('./middleware/error');
const express = require('express');
const app = express();

const mongoose = require('mongoose');

const TEST_DB = 'jitests';

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose
  .connect(
    `mongodb://localhost/${TEST_DB}`,
    { useNewUrlParser: true }
  )
  .then(() => debugM('Connected to MongoDB...'))
  .catch(err => debugM('Could not connect', err));

//Logging only on development environment
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled');
}

// debug('name', config.get('name'));
// debug('mail.host', config.get('mail.host'));
// debug('mail.password', config.get('mail.password'));

app.use(helmet());
app.use(express.json());

//Routes
app.use('/api/funits', fUnits);
app.use('/api/expenses', expenses);
app.use('/api/consortia', consortia);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/', home);

app.use(error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => debug(`Listening on port ${PORT}...`));
