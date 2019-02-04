const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');
// const debug = require('debug')('model:users');

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
    unique: true
  },
  password: {
    type: String,
    minlength: 5,
    maxlenght: 1024,
    trim: true
  },
  role: {
    type: String,
    enum: ['Administrador', 'Consejal', 'Usuario'],
    defaut: 'Usuario',
    trim: true
  },
  landlord: {
    type: Boolean,
    required: true
  },
  isAdmin: { type: Boolean, required: true }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get('jwtPrivateKey')
  );
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
      .required(),
    role: Joi.string().required(),
    landlord: Joi.boolean(),
    isAdmin: Joi.boolean().required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUsers;
