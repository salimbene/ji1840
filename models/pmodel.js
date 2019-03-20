const debug = require('debug')('models:pmodels');
// const ObjectId = mongoose.Types.ObjectId;
const mongoose = require('mongoose');
const Joi = require('joi');

const pModelSchema = mongoose.Schema({
  label: { type: String, trim: true, required: true },
  fUnits: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'funits',
      required: true
    }
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  coefficient: { type: Number, required: true }
});

const PModel = mongoose.model('pmodel', pModelSchema);

function validatepModelSchema(pdetails) {
  const schema = {
    label: Joi.string().required(),
    fUnits: Joi.array().required(),
    userId: Joi.ObjectId().required(),
    coefficient: Joi.number().required()
  };

  return Joi.validate(pdetails, schema);
}

exports.PModel = PModel;
exports.validate = validatepModelSchema;
