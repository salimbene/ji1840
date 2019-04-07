const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { PDetails, validate } = require('../models/pdetails');
const { Period } = require('../models/period');
const _ = require('lodash');
const debug = require('debug')('routes:pdetails');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const pdetails = await PDetails.find()
    .populate('userId', '-password -isAdmin', 'User')
    .populate('model', '', 'pmodel')
    .sort('period');

  debug(pdetails);
  res.send(pdetails);
});

router.get('/:id', async (req, res) => {
  try {
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
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`La liquidación con ID: ${req.params.id} no existe.`);
  }
});

router.post('/', [auth, admin], async (req, res) => {
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

router.put('/:id', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const {
    isPayedA: newIsPayedA,
    isPayedB: newIsPayedB,
    period: currentPeriod
  } = req.body;

  const pdetails = await PDetails.findOneAndUpdate(
    { _id: req.params.id },
    { isPayedA: !newIsPayedA, isPayedB: !newIsPayedB },
    { new: true }
  );
  await pdetails.save();

  const {
    expenseA,
    debtA,
    intA,
    isPayedA,
    expenseB,
    debtB,
    intB,
    isPayedB
  } = pdetails;

  const paymentA = expenseA + debtA + intA;
  const paymentB = expenseB + debtB + intB;

  const period = await Period.findOneAndUpdate(
    { period: currentPeriod },
    {
      $inc: { incomeA: isPayedA ? paymentA : paymentA * -1 },
      $inc: { incomeB: isPayedB ? paymentB : paymentB * -1 }
    },
    { new: true }
  );
  await period.save();

  res.send(pdetails);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const pdetails = await PDetails.findByIdAndRemove(req.params.id);
    res.send(pdetails);
    debug(`La liquidación ID: ${pdetails._id} DELETED ok!`);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`La liquidación ID: ${req.params.id} no existe.`);
  }
});

module.exports = router;
