const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { PDetails, validate } = require('../models/pdetails');
const { Period } = require('../models/period');
const _ = require('lodash');
const debug = require('debug')('routes:pdetails');

const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const pdetails = await PDetails.find()
    .populate('userId', '-password -isAdmin', 'User')
    .populate('model', '', 'pmodel')
    .sort('period');

  debug(pdetails);
  res.send(pdetails);
});

router.get('/:id', auth, async (req, res) => {
  const pdetails = await PDetails.find()
    .where('period')
    .equals(req.params.id)
    .populate('userId', '-password -isAdmin', 'User')
    .populate([
      {
        path: 'model',
        model: 'pmodel',
        populate: {
          path: 'landlord',
          model: 'User',
          select: '-password -isAdmin'
        }
      }
    ])
    .populate([
      {
        path: 'model',
        model: 'pmodel',
        populate: {
          path: 'fUnits',
          model: 'fUnit'
        }
      }
    ])
    .select('-date -__v')
    .sort('isPayedA');

  res.send(pdetails);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let pdetails = await PDetails.findOne({ period: req.body.period });
  if (pdetails) return res.status(400).send('El período ya fue iniciado.');

  pdetails = new PDetails(
    _.pick(req.body, [
      'period',
      'model',
      'userId',
      'expenseA',
      'debtA',
      'intA',
      'isPayedA',
      'expenseB',
      'debtB',
      'intB',
      'isPayedB'
    ])
  );

  await pdetails.save();

  res.send(pdetails);
});

router.put('/:id', auth, async (req, res) => {
  //Validation
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { isPayedA, isPayedB, period: currentPeriod } = req.body;
  debug(currentPeriod);
  debug('isPayedA', isPayedA, 'isPayedB', isPayedB);

  const update = {};
  if (typeof isPayedA !== 'undefined') update.isPayedA = isPayedA;
  if (typeof isPayedB !== 'undefined') update.isPayedB = isPayedB;

  const pdetails = await PDetails.findOneAndUpdate(
    { _id: req.params.id },
    update,
    { new: true }
  );
  await pdetails.save();

  const { expenseA, debtA, intA, expenseB, debtB, intB } = req.body;
  let paymentA = 0;
  let paymentB = 0;
  const increment = {};

  if (typeof isPayedA !== 'undefined') {
    paymentA = expenseA + debtA + intA;
    increment.incomeA = isPayedA ? paymentA : paymentA * -1;
  }
  if (typeof isPayedB !== 'undefined') {
    paymentB = expenseB + debtB + intB;
    increment.incomeB = isPayedB ? paymentB : paymentB * -1;
  }

  const period = await Period.findOneAndUpdate(
    { period: currentPeriod },
    { $inc: increment },
    { new: true }
  );

  debug(period);
  await period.save();

  res.send(pdetails);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const pdetails = await PDetails.findByIdAndRemove(req.params.id);
  res.send(pdetails);
  debug(`La liquidación ID: ${pdetails._id} DELETED ok!`);
});

module.exports = router;
