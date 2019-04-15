const express = require('express');
const fUnits = require('../routes/funits');
const pmodels = require('../routes/pmodels');
const periods = require('../routes/periods');
const pdetails = require('../routes/pdetails');
const expenses = require('../routes/expenses');
const suppliers = require('../routes/suppliers');
const consortia = require('../routes/consortia');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/consortia', consortia);
  app.use('/api/pdetails', pdetails);
  app.use('/api/periods', periods);
  app.use('/api/pmodels', pmodels);
  app.use('/api/funits', fUnits);
  app.use('/api/expenses', expenses);
  app.use('/api/suppliers', suppliers);
  app.use('/api/users', users);
  app.use('/api/auth', auth);

  app.use(error);
};
