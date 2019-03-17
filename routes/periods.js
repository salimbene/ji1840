const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Period, validate } = require('../models/period');
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

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let period = await Period.findOne({ period: req.body.period });
  if (period) return res.status(400).send('Período ya registrado.');

  period = new Period(
    _.pick(req.body, [
      'period',
      'userId',
      'totalA',
      'totalB',
      'totalIncome',
      'isClosed',
      'date'
    ])
  );

  await period.save();

  // const { userId, ammount } = req.body;
  // const user = await User.findOneAndUpdate(
  //   { _id: userId },
  //   { $inc: { balance: ammount } },
  //   { new: true }
  // );
  // debug(user);

  res.send(period);
});

router.put('/:id', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { period, userId, totalA, totalB, totalIncome, isClosed } = req.body;

  const periods = await Period.findOneAndUpdate(
    { _id: req.params.id },
    { period, userId, totalA, totalB, totalIncome, isClosed },
    { new: true }
  );

  if (!periods)
    return res
      .status(404)
      .send(`El período con ID: ${req.params.id} no existe.`);

  res.send(periods);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const period = await Period.findByIdAndRemove(req.params.id);
    res.send(period);
    debug(`${period._id} DELETED ok!`);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`El período con ID: ${req.params.id} no existe.`);
  }
});

module.exports = router;
