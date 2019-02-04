const debug = require('debug')('routes:auth');
const { User } = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // {
  //   res.statusMessage = error.details[0].message;
  //   res.status(400).end();
  // }

  const user = await User.findOne({ mail: req.body.mail });
  if (!user) return res.status(400).send('El email no es válido.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return res.status(400).send('La clave no es válida');

  const token = user.generateAuthToken();

  res
    .status(200)
    .header('consortia-auth-token', token)
    .send(_.pick(user, ['_id', 'lastname', 'firstname', 'mail']));
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
