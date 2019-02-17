const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { User, validate } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const debug = require('debug')('routes:users');
const router = express.Router();

router.get('/', [auth], async (req, res) => {
  const users = await User.find()
    .where('lastname')
    .ne('DISPONIBLE')
    .select('-password -isAdmin')
    .sort('lastname');
  debug(users);
  res.send(users);
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.get('/:id', [auth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      '-password -isAdmin'
    );
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
  if (user) return res.status(400).send('Usuario ya registrado.');

  user = new User(
    _.pick(req.body, [
      'lastname',
      'firstname',
      'mail',
      'phone',
      'password',
      'notes',
      'balance',
      'tenant',
      'isLandlord',
      'isCouncil',
      'isAdmin'
    ])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  res
    .status(200)
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send(_.pick(user, ['_id', 'mail']));
});

router.put('/:id', [auth], async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    lastname,
    fistname,
    mail,
    phone,
    notes,
    balance,
    tenant,
    isLandlord,
    isCouncil,
    isAdmin
  } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: req.params.id },
    {
      lastname,
      fistname,
      mail,
      phone,
      notes,
      balance,
      tenant,
      isLandlord,
      isCouncil,
      isAdmin
    },
    { new: true }
  );

  if (!user)
    return res
      .status(404)
      .send(`El usuario con ID: ${req.params.id} no existe.`);

  res.send(user);
});

router.delete('/:id', [auth, admin], async (req, res) => {
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
