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

async function getPeriodPayments(period) {
  // userId = new ObjectId('5c5f833d1a2db7ad5ddeaeaf')
  const total = await Payment.aggregate(
    [
      { $match: { period } },
      { $group: { _id: '$period', total: { $sum: `$ammount` } } }
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  ).then(results => results);
  return total[0];
}

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

exports.PeriodPaymentsTotal = getPeriodPayments;
exports.Payment = Payment;
exports.validate = validatePayments;
