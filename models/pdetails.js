const debug = require('debug')('models:pdetails');
const Joi = require('joi');
const mongoose = require('mongoose');

const periodDetailsSchema = mongoose.Schema({
  period: { type: String, trim: true, required: true },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pmodel',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  expenseA: { type: Number, default: 0 }, //calculo: segun coeficiente
  debtA: { type: Number, default: 0 }, //calculo: pagos previos no realizados
  intA: { type: Number, default: 0 }, //calculo: aplicado a debtA
  isPayedA: { type: Boolean, default: false },
  expenseB: { type: Number, default: 0 }, //calculo: segun gastos del mes.
  debtB: { type: Number, default: 0 }, //calculo: pagos previos no realizados
  intB: { type: Number, default: 0 }, //calculo segun interes por debtB
  isPayedB: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

const PDetails = mongoose.model('pdetails', periodDetailsSchema);

function validatePeriodDetailsSchema(pdetails) {
  const schema = {
    period: Joi.string().required(),
    model: Joi.ObjectId().required(),
    userId: Joi.ObjectId().required(),
    expenseA: Joi.number().required(),
    debtA: Joi.number().required(),
    intA: Joi.number().required(),
    isPayedA: Joi.boolean().required(),
    expenseB: Joi.number().required(),
    debtB: Joi.number().required(),
    intB: Joi.number().required(),
    isPayedB: Joi.boolean().required()
  };

  return Joi.validate(pdetails, schema);
}

exports.PDetails = PDetails;
exports.validate = validatePeriodDetailsSchema;
