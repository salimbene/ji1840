const mongoose = require('mongoose');
const Joi = require('joi');

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
    ownerLastname: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    ownerFirstnames: { type: String, uppercase: true, trim: true },
    ownerMail: { type: String, lowercase: true, trim: true },
    ownerPhone: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    isOccupied: { type: Boolean }
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
    ownerLastname: Joi.string()
      .min(1)
      .required()
  };

  return Joi.validate(fUnit, schema);
}

exports.FUnit = FUnit;
exports.validate = validateFUnits;
