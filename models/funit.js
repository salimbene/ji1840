const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const debug = require('debug')('models:funits');
const Joi = require('joi');

const functionalUnitsSchema = mongoose.Schema({
  fUnit: { type: String, required: true },
  floor: { type: Number, enum: [0, 1, 2, 3], required: true },
  flat: {
    type: String,
    uppercase: true,
    trim: true
  },
  polygon: { type: String },
  coefficient: { type: Number },
  sup: {
    total: { type: Number, required: true },
    covered: { type: Number },
    uncovered: { type: Number },
    semi: { type: Number }
  },
  landlord: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // target collection,
    name: { type: String }
  }
});

const FUnit = mongoose.model('fUnit', functionalUnitsSchema);

async function getCoefficient(userId) {
  // userId = new ObjectId('5c5f833d1a2db7ad5ddeaeaf')
  const coef = await FUnit.aggregate(
    [
      { $match: { 'landlord.userId': new ObjectId(userId) } },
      { $group: { _id: '$landlord.userId', coef: { $sum: '$coefficient' } } }
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  ).then(results => results);
  return coef[0];
}

// Joi validation processes client input from the API, separated from mongoose
function validateFUnits(fUnit) {
  const schema = {
    fUnit: Joi.string().required(),
    floor: Joi.number()
      .max(3)
      .required(),
    flat: Joi.string()
      .min(1)
      .max(2),
    polygon: Joi.string(),
    sup: Joi.object().keys({
      total: Joi.number().required(),
      covered: Joi.number(),
      uncovered: Joi.number(),
      semi: Joi.number()
    }),
    coefficient: Joi.number().required(),
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
exports.getCoefficient = getCoefficient;
