const mongoose = require('mongoose');
const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);

const { functionalUnitsSchema } = require('./funit');

const debug = require('debug')('models:consortium');

const consortiumSchema = mongoose.Schema({
  name: { type: String, trim: true },
  functionalUnits: [{ type: functionalUnitsSchema, required: true }]
});

const Consortium = mongoose.model('Consortium', consortiumSchema);

function validateConsortium(consortium) {
  const schema = {
    name: Joi.string().required(),
    functionalUnits: Joi.array()
      .items(
        Joi.object().keys({
          fUnit: Joi.number().required(),
          floor: Joi.number()
            .max(3)
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
        })
      )
      .required()
  };

  return Joi.validate(consortium, schema);
}

exports.Consortium = Consortium;
exports.validate = validateConsortium;
