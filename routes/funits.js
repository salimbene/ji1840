const _ = require('lodash');
const debug = require('debug')('routes:funits');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const { FUnit, validate } = require('../models/funit');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const fUnits = await FUnit.find().sort('fUnit');
  res.send(fUnits);
});

router.get('/:id', async (req, res) => {
  try {
    const fUnits = await FUnit.findById(req.params.id);
    res.send(fUnits);
  } catch (ex) {
    res
      .status(404)
      .send(`La unidad funcional con ID: ${req.params.id} no existe.`);
  }
});

router.post('/', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { fUnit, floor, flat } = req.body;

  let fUnits = await FUnit.findOne({ fUnit, floor, flat });
  if (fUnits) return res.status(400).send('Unidad funcional ya registrada.');

  fUnits = new FUnit(
    _.pick(req.body, ['fUnit', 'floor', 'flat', 'share', 'landlord'])
  );

  await fUnits.save();

  res.send(
    _.pick(fUnits, ['_id', 'fUnit', 'floor', 'flat', 'share', 'landlord'])
  );
});

router.put('/:id', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { fUnit, floor, flat, share, landlord } = req.body;

  const fUnits = await FUnit.findOneAndUpdate(
    req.params.id,
    {
      fUnit,
      floor,
      flat,
      share,
      landlord
    },
    { new: true }
  );

  if (!fUnits)
    return res
      .status(404)
      .send(`El usuario con ID: ${req.params.id} no existe.`);

  res.send(fUnits);
});

router.delete('/:id', [auth, admin], [auth, admin], async (req, res) => {
  try {
    const fUnits = await FUnit.findByIdAndRemove(req.params.id);
    res.send(fUnits);
    debug(`${fUnits.lastname} DELETED ok!`);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`El usuario con ID: ${req.params.id} no existe.`);
  }
});

module.exports = router;
