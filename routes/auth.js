const config = require('config');

const { User } = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');
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

  let user = await User.findOne({ mail: req.body.mail });
  if (!user) return res.status(400).send('Invalid email');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  const token = user.generateAuthToken();

  res.send(token);
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

function validate(req) {
  const schema = {
    mail: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),

    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };

  return Joi.validate(req, schema);
}
module.exports = router;
