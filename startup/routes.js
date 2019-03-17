const express = require('express');
const compression = require('compression');
// const bodyParser = require('body-parser');
const fUnits = require('../routes/funits');
const pmodels = require('../routes/pmodels');
const periods = require('../routes/periods');
const pdetails = require('../routes/pdetails');
const expenses = require('../routes/expenses');
const payments = require('../routes/payments');
const suppliers = require('../routes/suppliers');
const balances = require('../routes/balances');
const users = require('../routes/users');
const home = require('../routes/home');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use(compression());
  // parse application/x-www-form-urlencoded
  // app.use(bodyParser.urlencoded({ extended: false }));
  // // parse application/json
  // app.use(bodyParser.json());
  //Routes
  app.use('/api/pdetails', pdetails);
  app.use('/api/periods', periods);
  app.use('/api/pmodels', pmodels);
  app.use('/api/funits', fUnits);
  app.use('/api/expenses', expenses);
  app.use('/api/payments', payments);
  app.use('/api/suppliers', suppliers);
  app.use('/api/balances', balances);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/', home);

  app.use(error);
};
