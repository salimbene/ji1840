const mongoose = require('mongoose');

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
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // target collection,
    lastname: { type: String }
  }
});

const FUnit = mongoose.model('fUnit', functionalUnitsSchema);

// Joi validation processes client input from the API, separated from mongoose
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
    landlord: Joi.object()
      .keys({
        user: Joi.ObjectId().required(),
        lastname: Joi.string().required()
      })
      .required()
  };

  return Joi.validate(fUnit, schema);
}

exports.FUnit = FUnit;
exports.functionalUnitsSchema = functionalUnitsSchema;
exports.validate = validateFUnits;
