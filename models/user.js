const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');
const debug = require('debug')('model:users');

const userSchema = mongoose.Schema({
  lastname: {
    type: String,
    maxlenght: 50,
    uppercase: true,
    default: '',
    trim: true
  },
  firstname: {
    type: String,
    maxlenght: 50,
    uppercase: true
  },
  mail: {
    type: String,
    minlength: 5,
    maxlenght: 255,
    lowercase: true,
    unique: true,
    required: true
  },
  phone: {
    type: String,
    maxlenght: 30,
    lowercase: true,
    default: ''
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  password: {
    type: String,
    minlength: 5,
    maxlenght: 1024,
    required: true,
    trim: true
  },
  balance: { type: Number, default: 0 },
  tenant: { type: String, default: '' },
  isLandlord: { type: Boolean, default: false },
  isCouncil: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.lastname,
      mail: this.mail,
      isLandlord: this.isLandlord,
      isCouncil: this.isCouncil,
      isAdmin: this.isAdmin
    },
    config.get('jwtPrivateKey')
  );
  return token;
};

const User = mongoose.model('User', userSchema);

function validateUsers(user) {
  const schema = {
    lastname: Joi.string().max(50),
    firstname: Joi.string().max(50),
    mail: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required(),
    phone: Joi.string()
      .allow('')
      .max(30),
    notes: Joi.string()
      .allow('')
      .max(500),
    password: Joi.string()
      .min(5)
      .max(255),
    balance: Joi.number().allow(0),
    tenant: Joi.string().allow(''),
    isLandlord: Joi.boolean(),
    isCouncil: Joi.boolean(),
    isAdmin: Joi.boolean()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUsers;
