const auth = require('../middleware/auth');
const { Expense, validate } = require('../models/expense');
const _ = require('lodash');
const express = require('express');
const debug = require('debug')('routes:expenses');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const expenses = await Expense.find().sort('month');
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
    _.pick(req.body, ['month', 'expenseTypeA', 'expenseTypeB'])
  );

  res.send(_.pick(expense, ['_id', 'month', 'expenseTypeA', 'expenseTypeB']));
});

router.put('/:id', async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const expense = await Expense.findOneAndUpdate(
    req.params.id,
    {
      month: req.body.month,
      expenseTypeA: req.body.expenseTypeA,
      expenseTypeB: req.body.expenseTypeB
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
