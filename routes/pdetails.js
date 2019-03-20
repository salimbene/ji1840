const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { PDetails, validate } = require('../models/pdetails');
// const { User } = require('../models/user');
const _ = require('lodash');
const debug = require('debug')('routes:payments');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const pdetails = await PDetails.find()
    .populate('userId', '-password -isAdmin', 'User')
    .populate('model', '', 'pmodel')
    .sort('period');
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
            path: 'userId',
            model: 'User',
            select: '-password -isAdmin'
          }
        }
      ])
      .sort('isPayed');

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
  if (pdetails) return res.status(400).send('El período ya fue registrado.');

  pdetails = new PDetails(
    _.pick(req.body, [
      'period',
      'model',
      'userId',
      'expenses',
      'extra',
      'debt',
      'int',
      'isPayed'
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
    period,
    model,
    userId,
    expenses,
    extra,
    debt,
    int,
    isPayed
  } = req.body;

  const pdetails = await PDetails.findOneAndUpdate(
    { _id: req.params.id },
    {
      period,
      model,
      userId,
      expenses,
      extra,
      debt,
      int,
      isPayed
    },
    { new: true }
  );

  if (!pdetails)
    return res
      .status(404)
      .send(`La liquidación con ID: ${req.params.id} no existe.`);

  // const { userId } = req.body;
  // const payment = 0;
  // const user = await User.findOneAndUpdate(
  //   { _id: userId },
  //   { $dec: { balance: payment } },
  //   { new: true }
  // );

  // debug(user);

  res.send(pdetails);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const pdetails = await PDetails.findByIdAndRemove(req.params.id);
    res.send(pdetails);
    debug(`${pdetails._id} DELETED ok!`);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`La liquidación ID: ${req.params.id} no existe.`);
  }
});

module.exports = router;
