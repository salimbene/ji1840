const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Period, validate } = require('../models/period');
const { PDetails } = require('../models/pdetails');
const { Expense, getPeriodExpenses } = require('../models/expense');
const { PModel } = require('../models/pmodel');
const { Consortia } = require('../models/consortia.js');
// const { User } = require('../models/user');
const _ = require('lodash');
const debug = require('debug')('routes:periods');

const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const period = await Period.find()
    .populate('userId', '-password -isAdmin', 'User')
    .sort('period');
  res.send(period);
});

router.get('/:id', auth, async (req, res) => {
  try {
    const period = await Period.findById(req.params.id).populate(
      'userId',
      '-password -isAdmin',
      'User'
    );

    res.send(period);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`El periodo con ID: ${req.params.id} no existe.`);
  }
});

router.get('/period/:id', auth, async (req, res) => {
  const period = await Period.findOne({ period: req.params.id });
  res.send(period);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let periodEntry = await Period.findOne({ period: req.body.period });
  if (periodEntry) return res.status(400).send('Período ya registrado.');

  periodEntry = new Period(
    _.pick(req.body, [
      'period',
      'userId',
      'expensesA',
      'expensesB',
      'incomeA',
      'incomeB',
      'isClosed'
    ])
  );

  // tomo datos del body
  const { period: currentPeriod, userId } = periodEntry;

  // tomo datos del consorcio para utilizar en los calculos
  const consortia = await Consortia.find();
  const consortExpensesA = consortia[0].expenseA;
  const consortInterest = consortia[0].interest;

  // consulto los gastos extraordinarios del mes
  const expenses = await Expense.find({ period: currentPeriod, type: 'B' });

  // tomo los esquemas y preparo coeficiente para calculo de extraordinarias
  const pmodels = await PModel.find();
  const pmodelsCount = pmodels.length;

  pmodels.forEach(async model => {
    // por cada esquema registrado, inicio liquidación
    const { _id: modelId, coefficient: modelCoefficient } = model;
    const pdetails = new PDetails({
      period: currentPeriod,
      model: modelId,
      userId, //submitted by
      expenseA: consortExpensesA * modelCoefficient,
      debtA: 0,
      intA: 0,
      isPayedA: false,
      expenseB: 0,
      debtB: 0,
      intB: 0,
      isPayedB: false
    });

    //Calculo de expenses extraordinarias con excepciones
    expenses.forEach(expense => {
      const { excluded, ammount } = expense;
      const coefPayment = pmodelsCount - excluded.length;
      let notExcluded = true;
      let expB = ammount / coefPayment;

      if (excluded.length === 0) {
        // si no hay excepciones, direcamente sumo el importe
        pdetails.expenseB += expB;
      } else
        excluded.forEach(excludedId => {
          // si hay excepciones, las considero
          if (String(excludedId) === String(modelId)) notExcluded = false;
        });
      if (notExcluded) pdetails.expenseB += expB;
    });

    //Calculo de deudas expenses ordinarias
    const debtsA = await PDetails.find({ model: modelId, isPayedA: false });
    debtsA.forEach(detail => {
      if (!detail.isPayedA) pdetails.debtA += detail.expenseA;
    });
    //Calculó de interés expenses ordinarias
    pdetails.intA = pdetails.debtA * consortInterest;

    //Calculo de deudas expenses ordinarias
    const debtsB = await PDetails.find({ model: modelId, isPayedB: false });
    debtsB.forEach(detail => {
      if (!detail.isPayedB) pdetails.debtB += detail.expenseB;
    });
    //Calculó de interés expenses ordinarias
    pdetails.intB = pdetails.debtB * consortInterest;

    pdetails
      .save()
      .then(result => {
        debug(
          `Entrada creadad OK - A:${pdetails.expenseA} B:${pdetails.expenseB}`
        );
      })
      .catch(err => {
        debug(err.errmsg);
        res
          .status(400)
          .send(`Informe al administrador el mensaje: ${err.errmsg}`);
      });
  });

  periodEntry.expensesA = consortExpensesA;
  periodEntry.expensesB = expenses.reduce(
    (prev, current) => (prev += current.ammount),
    0
  );

  periodEntry.incomeA = 0;
  periodEntry.incomeB = 0;

  periodEntry
    .save()
    .then(result => {
      debug(`Período creado OK: ${result}`);
      res.send(periodEntry);
    })
    .catch(err => {
      debug(err.errmsg);
      res.send(`Informe al administrador el mensaje: ${err.errmsg}`);
    });
});

router.put('/:id', auth, async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Cierre de período
  const { isClosed, period, expensesA, expensesB, incomeA, incomeB } = req.body;

  periods = await Period.findOneAndUpdate(
    { _id: req.params.id },
    { isClosed },
    { new: true }
  );
  debug('periods', periods);

  // Actualizo balances del consorcio
  const consort = await Consortia.find();
  const { _id: consortiaId } = consort[0];

  const consortia = await Consortia.findOneAndUpdate(
    { _id: consortiaId },
    {
      $inc: { balanceA: incomeA - expensesA, balanceB: incomeB - expensesB }
    },
    { new: true }
  );
  debug('consortia', consortia);

  res.send(periods);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const period = await Period.findById(req.params.id);
    // const period = await Period.findByIdAndRemove(req.params.id);

    const pdetails = await PDetails.find()
      .where('period')
      .equals(period.period);

    pdetails.forEach(pd => pd.delete());
    period.delete();

    res.status(200).send('Period and details deleted OK.');
    // debug(`${period._id} DELETED ok!`);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`El período con ID: ${req.params.id} no existe.`);
  }
});

module.exports = router;
