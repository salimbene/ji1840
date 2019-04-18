const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');
const { Supplier, validate } = require('../models/supplier');
const _ = require('lodash');
const debug = require('debug')('routes:suppliers');

const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const suppliers = await Supplier.find()
    .sort('category')
    .sort('name');
  res.send(suppliers);
});

router.get('/:id', auth, async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  res.send(supplier);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  supplier = new Supplier(
    _.pick(req.body, ['name', 'category', 'contact', 'comments', 'userId'])
  );

  await supplier.save();

  res.send(supplier);
});

router.put('/:id', auth, async (req, res) => {
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

router.delete('/:id', auth, async (req, res) => {
  const supplier = await Supplier.findByIdAndRemove(req.params.id);
  res.send(supplier);
  debug(`${supplier.name} DELETED ok!`);
});

module.exports = router;
