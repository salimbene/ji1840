const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Expense, validate, TotalExpenses } = require('../models/expense');
const _ = require('lodash');
const debug = require('debug')('routes:expenses');

const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const expenses = await Expense.find()
    .populate('userId', '-password -isAdmin', 'User')
    .sort('period');
  res.send(expenses);
});

router.get('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    res.send(expense);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`La expensa con ID: ${req.params.id} no existe.`);
  }
});

router.get('/period/:id', auth, async (req, res) => {
  const expenses = await Expense.find({ period: req.params.id });
  res.send(expenses);
});

router.get('/period/total/:id', auth, async (req, res) => {
  const total = await TotalExpenses(req.params.id);
  debug(req.params.id, total);
  res.send(total);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  expense = new Expense(
    _.pick(req.body, [
      'period',
      'category',
      'concept',
      'ammount',
      'type',
      'excluded',
      'userId',
      'date'
    ])
  );

  await expense.save();

  res.send(expense);
});

router.put('/:id', auth, async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    category,
    concept,
    ammount,
    type,
    period,
    excluded,
    userId
  } = req.body;

  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id },
    { category, concept, ammount, type, period, excluded, userId },
    { new: true }
  );

  if (!expense)
    return res
      .status(404)
      .send(`La expensa con ID: ${req.params.id} no existe.`);

  res.send(expense);
});

router.delete('/:id', [auth, admin], async (req, res) => {
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
