const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Period, validate } = require('../models/period');
const { PDetails } = require('../models/pdetails');
const { PModel } = require('../models/pmodel');
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

  let periodEntry = await Period.findOne({ period: req.body.period });
  if (periodEntry) return res.status(400).send('Período ya registrado.');

  periodEntry = new Period(
    _.pick(req.body, [
      'period',
      'userId',
      'totalA',
      'totalB',
      'totalIncome',
      'isClosed'
    ])
  );

  await periodEntry.save();
  const { period: currentPeriod, userId, totalA, totalB } = periodEntry;
  const pmodels = await PModel.find(); //.populate('fUnits', '', 'fUnit');

  pmodels.forEach(async model => {
    const { _id, coefficient } = model;
    const pdetails = new PDetails({
      period: currentPeriod,
      model: _id,
      userId: userId,
      expenses: totalA * coefficient, //calcular,
      extra: totalB / pmodels.length, //calcular,
      debt: 0, //calcular,
      int: 0, // calcular,
      isPayed: false
    });

    await pdetails.save();
    debug(pdetails);
  });

  // const { userId, ammount } = req.body;
  // const user = await User.findOneAndUpdate(
  //   { _id: userId },
  //   { $inc: { balance: ammount } },
  //   { new: true }
  // );
  // debug(user);

  res.send(periodEntry);
});

router.put('/:id', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // let periodEntry = await Period.findOne({ period: req.body.period });
  // if (periodEntry) return res.status(400).send('Período ya registrado.');

  const { period, userId, totalA, totalB, totalIncome, isClosed } = req.body;

  let periods;

  try {
    periods = await Period.findOneAndUpdate(
      { _id: req.params.id },
      { period, userId, totalA, totalB, totalIncome, isClosed },
      { new: true }
    );
  } catch (ex) {
    debug(ex.errmsg);
    return res.status(400).send(ex.errmsg);
  }

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
