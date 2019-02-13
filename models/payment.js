const debug = require('debug')('models:payments');
const mongoose = require('mongoose');

const paymentsSchema = mongoose.Schema({
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'funits',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  ammount: { type: Number, required: true },
  comments: { type: String, trim: true },
  period: { type: Date, default: Date.now },
  date: { type: Date, default: Date.now }
});

const Payment = mongoose.model('payment', mongoose.Schema(paymentsSchema));

function validatePayments(payment) {
  const schema = {
    unitId: Joi.ObjectId(),
    userId: Joi.ObjectId(),
    ammount: Joi.number().required(),
    comments: Joi.string().allow(''),
    period: Joi.date()
  };

  return Joi.validate(payment, schema);
}

exports.Payment = Payment;
exports.validate = validatePayments;
