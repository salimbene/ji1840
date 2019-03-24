const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Payment, PeriodPaymentsTotal, validate } = require('../models/payment');
const { User } = require('../models/user');
const _ = require('lodash');
const debug = require('debug')('routes:payments');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const payments = await Payment.find()
    .populate('userId', '-password -isAdmin', 'User')
    .populate('submittedBy', '-password -isAdmin', 'User')
    .sort('userId');
  res.send(payments);
});

router.get('/period/:id', async (req, res) => {
  const total = await PeriodPaymentsTotal(req.params.id);
  debug(req.params.id, total);
  res.send(total);
});

router.get('/user/:id', async (req, res) => {
  const payments = await Payment.find()
    .where('userId')
    .equals(req.params.id)
    .sort('userId');
  res.send(payments);
});

router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('userId', '-password -isAdmin', 'User')
      .populate('submittedBy', '-password -isAdmin', 'User');

    res.send(payment);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`El pago con ID: ${req.params.id} no existe.`);
  }
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  payment = new Payment(
    _.pick(req.body, [
      'userId',
      'submittedBy',
      'ammount',
      'comments',
      'period',
      'date'
    ])
  );

  await payment.save();

  const { userId, ammount } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { $inc: { balance: ammount } },
    { new: true }
  );

  debug(user);

  res.send(payment);
});

router.put('/:id', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { submmitedBy, userId, ammount, comments, period } = req.body;

  const payment = await Payment.findOneAndUpdate(
    { _id: req.params.id },
    { submmitedBy, userId, ammount, comments, period },
    { new: true }
  );

  if (!payment)
    return res.status(404).send(`El pago con ID: ${req.params.id} no existe.`);

  res.send(payment);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const payment = await Payment.findByIdAndRemove(req.params.id);
    res.send(payment);
    debug(`${payment._id} DELETED ok!`);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`El pago con ID: ${req.params.id} no existe.`);
  }
});

module.exports = router;
