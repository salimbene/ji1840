const debug = require('debug')('models:balance');
const Joi = require('joi');
const mongoose = require('mongoose');

const balanceSchema = mongoose.Schema({
  period: { type: String, trim: true, required: true },
  balanceA: { type: Number, required: true },
  balanceB: { type: Number, required: true },
  collectionA: { type: Number, required: true },
  collectionB: { type: Number, required: true },
  expenditures: { type: Number, required: true },
  isOpen: { type: Boolean, default: true },
  createdby: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  createdDate: { type: Date, default: Date.now },
  lastUpdateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  lastUpdateDate: { type: Date, default: Date.now }
});

const Balance = mongoose.model('Balance', balanceSchema);

function validateBalance(balance) {
  const schema = {
    period: Joi.string().required(),
    balanceA: Joi.number().required(),
    balanceB: Joi.number().required(),
    collectionA: Joi.number().required(),
    collectionB: Joi.number().required(),
    expenditures: Joi.number().required(),
    isOpen: Joi.boolean().required(),
    createdby: Joi.ObjectId().required(),
    createdDate: Joi.date().required(),
    lastUpdateBy: Joi.ObjectId().required(),
    lastUpdateDate: Joi.ObjectId.required()
  };

  return Joi.validate(balance, schema);
}

exports.Balance = Balance;
exports.validate = validateBalance;
