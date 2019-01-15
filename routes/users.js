const { User, validate } = require('../models/user');
const _ = require('lodash');
const express = require('express');
const debug = require('debug')('routes:users');
const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.find().sort('lastname');
  res.send(users);
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`El usuario con ID: ${req.params.id} no existe.`);
  }
});

router.post('/', async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  debug(req.body.mail);
  let user = await User.findOne({ mail: req.body.mail });
  if (user) return res.status(400).send('Usuario ya registrado.');

  user = new User(
    _.pick(req.body, ['lastname', 'firstname', 'mail', 'password'])
  );

  await user.save();

  // try {
  //   user = await user.save();
  //   debug(`${user.lastname} saved ok!`);
  // } catch (ex) {
  //   for (field in ex.errors) debug('Errors:', ex.errors[field].message);
  // }

  res.send(_.pick(user, ['_id', 'lastname', 'firstname', 'mail']));
});

router.put('/:id', async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOneAndUpdate(
    req.params.id,
    {
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      mail: req.body.mail,
      phone: req.body.phone,
      propietaryType: req.body.propietaryType,
      role: req.body.role
    },
    { new: true }
  );

  if (!user)
    return res
      .status(404)
      .send(`El usuario con ID: ${req.params.id} no existe.`);

  res.send(user);
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    res.send(user);
    debug(`${user.lastname} DELETED ok!`);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`El usuario con ID: ${req.params.id} no existe.`);
  }
});

module.exports = router;
