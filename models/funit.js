const mongoose = require('mongoose');
const Joi = require('joi');

const functionalUnitsSchema = mongoose.Schema({
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
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // target collection,
    name: { type: String }
  }
});

const FUnit = mongoose.model('fUnit', functionalUnitsSchema);

// Joi validation processes client input from the API, separated from mongoose
function validateFUnits(fUnit) {
  const schema = {
    _id: Joi.ObjectId().required(),
    fUnit: Joi.number().required(),
    floor: Joi.number()
      .max(2)
      .required(),
    flat: Joi.string()
      .min(1)
      .max(2)
      .required(),
    share: Joi.number().required(),
    landlord: Joi.object().keys({
      userId: Joi.ObjectId(),
      name: Joi.string()
    })
  };

  return Joi.validate(fUnit, schema);
}

exports.FUnit = FUnit;
exports.functionalUnitsSchema = functionalUnitsSchema;
exports.validate = validateFUnits;
