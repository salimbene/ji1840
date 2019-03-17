const debug = require('debug')('models:pdetails');
const Joi = require('joi');
const mongoose = require('mongoose');

const periodDetailsSchema = mongoose.Schema({
  period: { type: String, trim: true, required: true },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pmodels',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  expenses: { type: Number, default: 0 }, //calculo segun coeficiente
  extra: { type: Number, default: 0 }, //monto fijo adicional
  debt: { type: Number, default: 0 }, //calculo segun pagos no realizados
  int: { type: Number, default: 0 }, //calculo segun interes por deuda
  isOpen: { type: Boolean, default: true },
  date: { type: Date, default: Date.now }
});

const PDetails = mongoose.model('pdetails', periodDetailsSchema);

function validatePeriodDetailsSchema(pdetails) {
  const schema = {
    period: Joi.ObjectId().required(),
    model: Joi.ObjectId().required(),
    userId: Joi.ObjectId().required(),
    expenses: Joi.number().required(),
    extra: Joi.number().required(),
    debt: Joi.number().required(),
    int: Joi.number().required(),
    isOpen: Joi.boolean().required()
  };

  return Joi.validate(pdetails, schema);
}

exports.PDetails = PDetails;
exports.validate = validatePeriodDetailsSchema;
