const express = require('express');
// const bodyParser = require('body-parser');
const fUnits = require('../routes/funits');
const expenses = require('../routes/expenses');
const consortia = require('../routes/consortia');
const users = require('../routes/users');
const home = require('../routes/home');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  // parse application/x-www-form-urlencoded
  // app.use(bodyParser.urlencoded({ extended: false }));
  // // parse application/json
  // app.use(bodyParser.json());
  //Routes
  app.use('/api/funits', fUnits);
  app.use('/api/expenses', expenses);
  app.use('/api/consortia', consortia);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/', home);

  app.use(error);
};
