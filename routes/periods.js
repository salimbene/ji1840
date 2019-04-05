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

router.get('/', async (req, res) => {
  const period = await Period.find()
    .populate('userId', '-password -isAdmin', 'User')
    .sort('period');
  res.send(period);
});

router.get('/:id', async (req, res) => {
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

router.get('/period/:id', async (req, res) => {
  const period = await Period.findOne({ period: req.params.id });
  res.send(period);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let periodEntry = await Period.findOne({ period: req.body.period });
  if (periodEntry) return res.status(400).send('Período ya registrado.');

  periodEntry = new Period(
    _.pick(req.body, [
      'period',
      'userId',
      'totalA',
      'totalB',
      'totalIncome',
      'totalExpenses',
      'isClosed'
    ])
  );

  const { period: currentPeriod, userId } = periodEntry;

  const consortia = await Consortia.find();
  const totalA = consortia[0].expA;
  const int = consortia[0].int;

  const expenses = await Expense.find({ period: currentPeriod, type: 'B' });

  const pmodels = await PModel.find();
  const pmodelsCount = pmodels.length;

  pmodels.forEach(async model => {
    const { _id, coefficient } = model;
    const pdetails = new PDetails({
      period: currentPeriod,
      model: _id,
      userId: userId,
      expenses: totalA * coefficient,
      extra: 0,
      debt: 0,
      int: 0,
      isPayed: false
    });
    //Calculo de expenses extra-ordinarias con excepciones
    expenses.forEach(expense => {
      const { excluded, ammount } = expense;
      const coefPayment = pmodelsCount - excluded.length;
      let notExcluded = true;
      expB = ammount / coefPayment;

      if (excluded.length === 0) {
        pdetails.extra += expB;
      } else
        excluded.forEach(o => {
          if (String(o) === String(_id)) notExcluded = false;
        });
      if (notExcluded) pdetails.extra += expB;
    });

    //Calculo de deudas
    const debts = await PDetails.find({ model: _id, isPayed: false });
    debts.forEach(d => {
      if (!d.isPayed) pdetails.debt = +d.ammount;
    });

    //Calculó de interés 3%
    pdetails.int = pdetails.debt * int;

    pdetails
      .save()
      .then(result => {
        debug(`Entrada creadad OK: ${pdetails.extra}`);
      })
      .catch(err => {
        debug(err.errmsg);
        res
          .status(400)
          .send(`Informe al administrador el mensaje: ${err.errmsg}`);
      });
  });

  periodEntry.totalA = totalA;
  periodEntry.totalB = expenses.reduce(
    (prev, current) => (prev += current.ammount),
    0
  );
  const periodExpenses = await getPeriodExpenses(currentPeriod);
  periodEntry.totalExpenses = periodExpenses.reduce(
    (prev, current) => (prev += current.total),
    0
  );

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

router.put('/:id', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { isClosed, period, totalB, totalIncome } = req.body;

  try {
    periods = await Period.findOneAndUpdate(
      { _id: req.params.id },
      { isClosed: !isClosed },
      { new: true }
    );
  } catch (ex) {
    debug(ex.errmsg);
    return res.status(400).send(ex.errmsg);
  }

  const consortia = await Consortia.find();
  const { _id: consortiaId } = consortia[0];
  expenses = getPeriodExpenses(period);
  // tomar gastos A y gastos B
  await Consortia.findOneAndUpdate(
    { _id: consortiaId },
    { $inc: { balanceA: 0 } }, // - gastos A + totalimcome - total b
    { $inc: { balanceB: 0 } }, // - gastos B + total B
    { new: true }
  );

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
