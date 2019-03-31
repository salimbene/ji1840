const debug = require('debug')('models:consortia');
const Joi = require('joi');
const mongoose = require('mongoose');

const consortiaSchema = mongoose.Schema({
  name: { type: String, trim: true, required: true },
  address: { type: String, trim: true, required: true },
  cbu: { type: String, trim: true, required: true },
  bank: { type: String, trim: true, required: true },
  mail: { type: String, trim: true, required: true },
  expA: { type: Number, required: true },
  expB: { type: Number, required: true },
  int: { type: Number, required: true },
  balanceA: { type: Number, required: true },
  balanceB: { type: Number, required: true }
});

const Consortia = mongoose.model('Consortia', consortiaSchema);

function validateConsortia(consortia) {
  const schema = {
    name: Joi.string().required(),
    address: Joi.string().required(),
    cbu: Joi.string().required(),
    bank: Joi.string().required(),
    mail: Joi.string()
      .email()
      .required(),
    expA: Joi.number()
      .allow(0)
      .required(),
    expB: Joi.number()
      .allow(0)
      .required(),
    int: Joi.number()
      .allow(0)
      .required(),
    balanceA: Joi.number()
      .allow(0)
      .required(),
    balanceB: Joi.number()
      .allow(0)
      .required()
  };

  return Joi.validate(consortia, schema);
}

exports.Consortia = Consortia;
exports.validate = validateConsortia;
