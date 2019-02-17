const debug = require('debug')('models:period');
const mongoose = require('mongoose');

const periodSchema = mongoose.Schema({
  period: { type: String, trim: true, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  coefficient: { type: Number, required: true },
  previousExpense: { type: Number, required: true },
  previousPayments: { type: Number, required: true },
  currentExpense: { type: Number, required: true },
  debt: { type: Number, required: true },
  interest: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Period = mongoose.model('period', periodSchema);

function validatePeriod(period) {
  const schema = {
    name: Joi.string().required(),
    fUnits: Joi.array()
      .items(Joi.ObjectId())
      .required()
  };

  return Joi.validate(period, schema);
}

exports.Period = Period;
exports.validate = validateCPeriod;
