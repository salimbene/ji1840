const mongoose = require('mongoose');
const Joi = require('joi');

const debtSchema = new mongoose.Schema({
  // date: { type: Date },
  ammount: { type: Number }
  // canceled: { type: Date }
});

const Debt = mongoose.model('debt', debtSchema);

const FUnit = mongoose.model(
  'fUnit',
  mongoose.Schema({
    fUnit: { type: Number, required: true },
    floor: { type: Number, enum: [0, 1, 2], required: true },
    flat: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'CH'],
      uppercase: true,
      trim: true,
      required: true
    },
    share: { type: Number, required: true },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user' // target collection
    },
    debts: [debtSchema]
  })
);

function validateFUnits(fUnit) {
  const schema = {
    fUnit: Joi.number().required(),
    floor: Joi.number()
      .max(2)
      .required(),
    flat: Joi.string()
      .min(1)
      .max(2)
      .required(),
    share: Joi.number().required(),
    landlord: Joi.string()
      .min(1)
      .required()
  };

  return Joi.validate(fUnit, schema);
}

exports.Debt = Debt;
exports.FUnit = FUnit;
exports.validate = validateFUnits;
