const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
// const Joi.ObjectId = require('joi-objectid')(joi); //Add Object ID validation function to Joi.
// joi-password-complexity
const debug = require('debug')('model:users');

const userSchema = mongoose.Schema({
  lastname: {
    type: String,
    minlength: 5,
    maxlenght: 50,
    uppercase: true,
    trim: true,
    required: true
  },
  firstname: {
    type: String,
    minlength: 5,
    maxlenght: 50,
    uppercase: true,
    trim: true
  },
  mail: {
    type: String,
    minlength: 5,
    maxlenght: 255,
    lowercase: true,
    trim: true,
    unique: true
  },
  // phone: { type: Number, required: true },
  password: {
    type: String,
    minlength: 5,
    maxlenght: 1024,
    trim: true
  }
  // propietaryType: {
  //   type: String,
  //   enum: ['Propietario', 'Inquilino'],
  //   required: true
  // },
  // role: { type: String, enum: ['Administrador', 'Consejal', 'Usuario'] }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
  return token;
};

const User = mongoose.model('User', userSchema);

function validateUsers(user) {
  const schema = {
    lastname: Joi.string()
      .min(5)
      .max(50)
      .required(),

    firstname: Joi.string()
      .min(5)
      .max(50)
      .required(),

    mail: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),

    password: Joi.string()
      .min(5)
      .max(255)
      .required()

    // phone: Joi.number().required(),
    // propietaryType: Joi.string().required(),
    // role: Joi.string().required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUsers;
