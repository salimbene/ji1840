const { FUnit, validate } = require('../models/funit');
const express = require('express');
const debug = require('debug')('routes:funits');
const router = express.Router();

router.get('/', async (req, res) => {
  const fUnits = await FUnit.find().sort('fUnit');
  res.send(fUnits);
});

router.get('/:id', async (req, res) => {
  const fUnit = await FUnit.findById(req.params.id);

  if (!fUnit)
    return res
      .status(404)
      .send('La unidad funcional con el ID indicado no existe.');

  res.send(req.params.id);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let fUnit = new FUnit({
    fUnit: req.body.fUnit,
    floor: req.body.floor,
    flat: req.body.flat,
    share: req.body.share,
    ownerLastname: req.body.ownerLastname
  });

  try {
    fUnit = await fUnit.save();
  } catch (ex) {
    for (field in ex.errors) debug('Errors:', ex.errors[field].message);
  }

  res.send(fUnit);
});

router.put('/:id', async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  try {
    const fUnit = await FUnit.findByIdAndUpdate(
      req.paramms.id,
      { fUnit: req.body.fUnit },
      { new: true }
    );
  } catch (ex) {
    for (field in ex.errors) debug('Errors:', ex.errors[field].message);
  }

  if (!fUnit)
    return res
      .status(404)
      .send('La unidad funcional con el ID indicado no existe.');

  res.send(fUnit);
});

router.delete('/:id', async (req, res) => {
  const fUnit = await FUnit.findByIdAndRemove(req.params.id);

  if (!fUnit)
    return res
      .status(404)
      .send('La unidad funcional con el ID indicado no existe.');

  req.send(fUnit);
});

module.exports = router;
