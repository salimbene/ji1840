const debug = require('debug')('models:pdetails');
const Joi = require('joi');
const mongoose = require('mongoose');

const periodDetailsSchema = mongoose.Schema({
  period: { type: String, trim: true, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  coefficient: { type: Number, required: true },
  debtA: { type: Number, default: 0 },
  expenseA: { type: Number, required: true },
  interestA: { type: Number, default: 0 },
  isSettledA: { type: Boolean, default: false },
  debtB: { type: Number, default: 0 },
  interestB: { type: Number, default: 0 },
  expenseB: { type: Number, default: 0 },
  isSettledB: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

const PDetails = mongoose.model('pdetails', periodDetailsSchema);

function validatePeriodDetailsSchema(pdetails) {
  const schema = {
    period: Joi.string().required(),
    userId: Joi.ObjectId().required(),
    coefficient: Joi.number().required(),
    debtA: Joi.number().required(),
    expenseA: Joi.number().required(),
    interestA: Joi.number().required(),
    debtB: Joi.number().required(),
    expenseB: Joi.number().required(),
    interestB: Joi.number().required(),
    isSettledA: Joi.boolean().required(),
    isSettledB: Joi.boolean().required()
  };

  return Joi.validate(pdetails, schema);
}

exports.PDetails = PDetails;
exports.validate = validatePeriodDetailsSchema;
