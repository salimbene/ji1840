const _ = require('lodash');
const { Consortia, validate } = require('../models/consortia');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const debug = require('debug')('routes:consortia');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const consortia = await Consortia.find();
  res.send(consortia);
});

router.post('/', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  debug(req.body);
  let consortia = await Consortia.findOne({ name: req.body.name });
  if (consortia) return res.status(400).send('El consorcio ya existe.');

  consortia = new Consortia(
    _.pick(req.body, [
      'name',
      'address',
      'cbu',
      'bank',
      'mail',
      'expenseA',
      'expenseB', // unused
      'interest',
      'balanceA',
      'balanceB'
    ])
  );

  await consortia.save();

  res.send(consortia);
});

router.put('/:id', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    name,
    address,
    cbu,
    bank,
    mail,
    expenseA,
    expenseB,
    interest,
    balanceA,
    balanceB
  } = req.body;

  const consortia = await Consortia.findOneAndUpdate(
    { _id: req.params.id },
    {
      name,
      address,
      cbu,
      bank,
      mail,
      expenseA,
      expenseB,
      interest,
      balanceA,
      balanceB
    },
    { new: true }
  );

  if (!consortia)
    return res
      .status(404)
      .send(`El consorcio con identificador ${req.params.id} no existe.`);

  res.send(consortia);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const consortia = await Consortia.findByIdAndRemove(req.params.id);
    res.send(consortia);
    debug(`${consortia.name} DELETED ok!`);
  } catch (ex) {
    debug(ex.message);
    res
      .status(404)
      .send(`El consorcio con identificador ${req.params.id} no existe.`);
  }
});

module.exports = router;
