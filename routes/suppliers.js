const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Supplier, validate } = require('../models/supplier');
const _ = require('lodash');
const debug = require('debug')('routes:suppliers');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const suppliers = await Supplier.find()
    .sort('category')
    .sort('name');
  res.send(suppliers);
});

router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    res.send(supplier);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`El proveedor con ID: ${req.params.id} no existe.`);
  }
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  supplier = new Supplier(
    _.pick(req.body, ['name', 'category', 'contact', 'comments', 'userId'])
  );

  await supplier.save();

  res.send(supplier);
});

router.put('/:id', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, category, contact, comments } = req.body;

  const supplier = await Supplier.findOneAndUpdate(
    { _id: req.params.id },
    { name, category, contact, comments },
    { new: true }
  );

  if (!supplier)
    return res
      .status(404)
      .send(`El proveedor con ID: ${req.params.id} no existe.`);

  res.send(supplier);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndRemove(req.params.id);
    res.send(supplier);
    debug(`${supplier.name} DELETED ok!`);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`El proveedor con ID: ${req.params.id} no existe.`);
  }
});

module.exports = router;
