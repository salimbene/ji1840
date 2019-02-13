const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Payment, validate } = require('../models/payment');
const _ = require('lodash');
const debug = require('debug')('routes:payments');
const { User } = require('../models/user');
const { FUnit } = require('../models/funit');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const payments = await Payment.find()
    .populate({
      path: 'userId',
      model: User
    })
    .populate({
      path: 'unitId',
      model: FUnit
    })
    .sort('period');
  res.send(payments);
});

router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
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
      'unitId',
      'userId',
      'ammount',
      'comments',
      'period',
      'date'
    ])
  );

  await payment.save();

  res.send(payment);
});

router.put('/:id', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { unitId, userId, ammount, comments, period } = req.body;

  const payment = await Payment.findOneAndUpdate(
    { _id: req.params.id },
    { unitId, userId, ammount, comments, period },
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
    debug(`${payment.month} DELETED ok!`);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`El pago con ID: ${req.params.id} no existe.`);
  }
});

module.exports = router;
