const mongoose = require('mongoose');
const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);

const debug = require('debug')('models:consortium');

const consortiumSchema = mongoose.Schema({
  name: { type: String, trim: true },
  fUnits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'funits' }]
});

const Consortium = mongoose.model('Consortium', consortiumSchema);

function validateConsortium(consortium) {
  const schema = {
    name: Joi.string().required(),
    fUnits: Joi.array()
      .items(Joi.ObjectId())
      .required()
  };

  return Joi.validate(consortium, schema);
}

exports.Consortium = Consortium;
exports.validate = validateConsortium;
