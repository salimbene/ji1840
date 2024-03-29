const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { PModel, validate } = require('../models/pmodel');
const _ = require('lodash');
const debug = require('debug')('routes:pmodel');

const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const pmodel = await PModel.find()
    .populate('fUnits', '', 'fUnit')
    .populate('landlord', '', 'User');
  // .sort('userId');
  res.send(pmodel);
});

router.get('/:id', auth, async (req, res) => {
  const pmodel = await PModel.findById(req.params.id)
    .populate('fUnits', '', 'fUnit')
    .populate('landlord', '', 'User');

  res.send(pmodel);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let pmodel = await PModel.findOne({ label: req.body.label });
  if (pmodel) return res.status(400).send('El modelo ya existe.');

  pmodel = new PModel(
    _.pick(req.body, ['label', 'fUnits', 'landlord', 'coefficient'])
  );

  await pmodel.save();

  res.send(pmodel);
});

router.put('/:id', auth, async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { label, fUnits, landlord, coefficient } = req.body;

  const pmodel = await PModel.findOneAndUpdate(
    { _id: req.params.id },
    { label, fUnits, landlord, coefficient },
    { new: true }
  );

  if (!pmodel)
    return res
      .status(404)
      .send(`El modelo de expensa ID: ${req.params.id} no existe.`);

  res.send(pmodel);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const pmodel = await PModel.findByIdAndRemove(req.params.id);
  res.send(pmodel);
  debug(`${pmodel._id} DELETED ok!`);
});

module.exports = router;
