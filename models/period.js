const debug = require('debug')('models:periods');
const Joi = require('joi');
const mongoose = require('mongoose');

const periodSchema = mongoose.Schema({
  period: { type: String, trim: true, required: true, unique: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  expensesA: { type: Number, default: 0 },
  expensesB: { type: Number, default: 0 },
  incomeA: { type: Number, default: 0 },
  incomeB: { type: Number, default: 0 },
  isClosed: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

const Period = mongoose.model('periods', periodSchema);

function validatePeriodSchema(periods) {
  const schema = {
    period: Joi.string().required(),
    userId: Joi.ObjectId().required(),
    expensesA: Joi.number().required(),
    expensesB: Joi.number().required(),
    incomeA: Joi.number().required(),
    incomeB: Joi.number().required(),
    isClosed: Joi.boolean().required()
  };

  return Joi.validate(periods, schema);
}

exports.Period = Period;
exports.validate = validatePeriodSchema;
