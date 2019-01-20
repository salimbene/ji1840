const auth = require('../middleware/auth');
const { Expense, validate } = require('../models/expense');
const _ = require('lodash');
const debug = require('debug')('routes:expenses');
const { User } = require('../models/user');
const { FUnit } = require('../models/funit');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const expenses = await Expense.find()
    .populate({
      path: 'payments.user',
      model: User
    })
    .populate({
      path: 'payments.fUnit',
      model: FUnit
    })
    .sort('month');
  res.send(expenses);
});

router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    res.send(expense);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`La expensa con ID: ${req.params.id} no existe.`);
  }
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  expense = new Expense(
    _.pick(req.body, [
      'month',
      'year',
      'eTypeA',
      'eTypeB',
      'expenses',
      'payments'
    ])
  );

  await expense.save();

  res.send(expense);
});

router.put('/:id', async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { month, year, eTypeA, eTypeB, expenses, payments } = req.body;

  const expense = await Expense.findOneAndUpdate(
    req.params.id,
    {
      month: month,
      year: year,
      eTypeA: eTypeA,
      eTypeB: eTypeB,
      expenses: expenses,
      payments: payments
    },
    { new: true }
  );

  if (!expense)
    return res
      .status(404)
      .send(`La expensa con ID: ${req.params.id} no existe.`);

  res.send(expense);
});

router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndRemove(req.params.id);
    res.send(expense);
    debug(`${expense.month} DELETED ok!`);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`La expensa con ID: ${req.params.id} no existe.`);
  }
});

module.exports = router;
