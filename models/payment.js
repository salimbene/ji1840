const debug = require('debug')('models:payments');
const Joi = require('joi');
const mongoose = require('mongoose');

const paymentsSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  ammount: { type: Number, required: true },
  comments: { type: String, trim: true },
  period: { type: String, trim: true, required: true },
  date: { type: Date, default: Date.now }
});

const Payment = mongoose.model('payment', mongoose.Schema(paymentsSchema));

function validatePayments(payment) {
  const schema = {
    userId: Joi.ObjectId().required(),
    submittedBy: Joi.ObjectId().required(),
    ammount: Joi.number().required(),
    comments: Joi.string().allow(''),
    period: Joi.string().required()
  };

  return Joi.validate(payment, schema);
}

exports.Payment = Payment;
exports.validate = validatePayments;
