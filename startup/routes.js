const express = require('express');
const fUnits = require('../routes/funits');
const expenses = require('../routes/expenses');
const consortia = require('../routes/consortia');
const users = require('../routes/users');
const home = require('../routes/home');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());

  //Routes
  app.use('/api/funits', fUnits);
  app.use('/api/expenses', expenses);
  app.use('/api/consortia', consortia);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/', home);

  app.use(error);
};
