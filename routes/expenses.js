const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Expense, validate } = require('../models/expense');
const _ = require('lodash');
const debug = require('debug')('routes:expenses');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const expenses = await Expense.find()
    .populate('userId', '-password -isAdmin', 'User')
    .sort('period');
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

router.get('/period/:id', async (req, res) => {
  const expense = await Expense.find({ period: req.params.id }).sort('-date');
  res.send(expense);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  expense = new Expense(
    _.pick(req.body, [
      'category',
      'concept',
      'ammount',
      'period',
      'userId',
      'date'
    ])
  );

  await expense.save();

  res.send(expense);
});

router.put('/:id', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { category, concept, ammount, type, period, userId } = req.body;

  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id },
    { category, concept, ammount, type, period, userId },
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
