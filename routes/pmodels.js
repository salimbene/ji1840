const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { PModel, validate } = require('../models/pmodel');
const _ = require('lodash');
const debug = require('debug')('routes:pmodel');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const pmodel = await PModel.find()
    .populate('fUnits', '', 'fUnit')
    .populate('userId', '', 'User');
  // .sort('userId');
  res.send(pmodel);
});

router.get('/:id', async (req, res) => {
  try {
    const pmodel = await PModel.findById(req.params.id)
      .populate('fUnits', '', 'fUnit')
      .populate('userId', '', 'User');

    res.send(pmodel);
  } catch (ex) {
    debug(ex.message);
    res
      .status(404)
      .send(`El modelo de expensa ID: ${req.params.id} no existe.`);
  }
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let pmodel = await PModel.findOne({ label: req.body.label });
  if (pmodel) return res.status(400).send('El modelo ya existe.');

  pmodel = new PModel(
    _.pick(req.body, ['label', 'fUnits', 'userId', 'coefficient'])
  );

  await pmodel.save();

  res.send(pmodel);
});

router.put('/:id', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { label, fUnits, userId, coefficient } = req.body;

  const pmodel = await PModel.findOneAndUpdate(
    { _id: req.params.id },
    { label, fUnits, userId, coefficient },
    { new: true }
  );

  if (!pmodel)
    return res
      .status(404)
      .send(`El modelo de expensa ID: ${req.params.id} no existe.`);

  // const { userId } = req.body;
  // const payment = 0;
  // const user = await User.findOneAndUpdate(
  //   { _id: userId },
  //   { $dec: { balance: payment } },
  //   { new: true }
  // );

  // debug(user);

  res.send(pmodel);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const pmodel = await PModel.findByIdAndRemove(req.params.id);
    res.send(pmodel);
    debug(`${pmodel._id} DELETED ok!`);
  } catch (ex) {
    debug(ex.message);
    res
      .status(404)
      .send(`El modelo de expensa ID: ${req.params.id} no existe.`);
  }
});

module.exports = router;
