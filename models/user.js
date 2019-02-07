const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');
// const debug = require('debug')('model:users');

const userSchema = mongoose.Schema({
  lastname: {
    type: String,
    maxlenght: 50,
    uppercase: true,
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
  password: {
    type: String,
    minlength: 5,
    maxlenght: 1024,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['Administrador', 'Consejal', 'Usuario'],
    default: 'Usuario',
    trim: true
  },
  landlord: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false }
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
    lastname: Joi.string().max(50),
    firstname: Joi.string().max(50),
    mail: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    role: Joi.string(),
    landlord: Joi.boolean(),
    isAdmin: Joi.boolean()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUsers;
