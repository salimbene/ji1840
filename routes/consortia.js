const _ = require('lodash');
const { Consortium, validate } = require('../models/consortium');
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const debug = require('debug')('routes:consortia');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const consortium = await Consortium.find()
    // .populate({
    //   path: 'functionalUnits.landlord.user',
    //   model: User
    // })
    .sort('name');
  res.send(consortium);
});

router.post('/', async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  debug(req.body);
  let consortium = await Consortium.findOne({ name: req.body.name });
  if (consortium) return res.status(400).send('El consorsio ya existe.');

  consortium = new Consortium(
    _.pick(req.body, [
      'name',
      // 'manager',
      // 'councilors',
      'functionalUnits'
    ])
  );

  await consortium.save();

  res.send(consortium);
});

router.put('/:id', async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, functionalUnits } = req.body;
  const consortium = await Consortia.findOneAndUpdate(
    req.params.id,
    {
      name: name,
      functionalUnits: functionalUnits
    },
    { new: true }
  );

  if (!consortium)
    return res
      .status(404)
      .send(`El consorcio con ID: ${req.params.id} no existe.`);

  res.send(consortium);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const consortium = await User.findByIdAndRemove(req.params.id);
    res.send(consortium);
    debug(`${consortium.name} DELETED ok!`);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`El consorcio con ID: ${req.params.id} no existe.`);
  }
});

module.exports = router;
