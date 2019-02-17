const _ = require('lodash');
const { Balance, validate } = require('../models/balance');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const debug = require('debug')('routes:balances');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const balance = await Balance.find().sort('_id');
  res.send(balance);
});

router.post('/', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  debug(req.body);
  let balance = await Balance.findOne({ period: req.body.period });
  if (balance) return res.status(400).send('El balance ya existe.');

  balance = new Balance(
    _.pick(req.body, [
      'period',
      'balanceA',
      'balanceB',
      'collectionA',
      'collectionB',
      'expenditures',
      'isOpen',
      'createdBy',
      'createdDate',
      'lastUpdatedBy',
      'lastUpdatedDate'
    ])
  );

  await balance.save();

  res.send(balance);
});

router.put('/:id', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    period,
    balanceA,
    balanceB,
    collectionA,
    collectionB,
    expenditures,
    isOpen,
    createdBy,
    createdDate,
    lastUpdateBy,
    lastUpdateDate
  } = req.body;

  const balance = await Balance.findOneAndUpdate(
    { _id: req.params.id },
    {
      period,
      balanceA,
      balanceB,
      collectionA,
      collectionB,
      expenditures,
      isOpen,
      createdBy,
      createdDate,
      lastUpdateBy,
      lastUpdateDate
    },
    { new: true }
  );

  if (!balance)
    return res
      .status(404)
      .send(`El balance con identificador ${req.params.id} no existe.`);

  res.send(balance);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const balance = await Balance.findByIdAndRemove(req.params.id);
    res.send(balance);
    debug(`${balance.period} DELETED ok!`);
  } catch (ex) {
    debug(ex.message);
    res
      .status(404)
      .send(`El balance con identificador ${req.params.id} no existe.`);
  }
});

module.exports = router;
