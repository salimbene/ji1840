const mongoose = require('mongoose');
const Joi = require('joi');
const debug = require('debug')('models:users');

const User = mongoose.model(
  'user',
  mongoose.Schema({
    lastname: { type: String, uppercase: true, trim: true, required: true },
    firstname: { type: String, uppercase: true, trim: true },
    mail: { type: String, lowercase: true, trim: true },
    phone: { type: Number, required: true },
    propietaryType: {
      type: String,
      enum: ['Propietario', 'Inquilino'],
      required: true
    },
    role: { type: String, enum: ['Administrador', 'Consejal', 'Usuario'] }
  })
);

function validateUsers(user) {
  const schema = {
    lastname: Joi.string().required(),
    firstname: Joi.string(),
    mail: Joi.string(),
    phone: Joi.number().required(),
    propietaryType: Joi.string().required(),
    role: Joi.string().required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUsers;
