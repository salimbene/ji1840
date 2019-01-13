const mongoose = require('mongoose');
const debug = require('debug')('models:consortium');
const Joi = require('joi');

const fUnitSchema = new mongoose.Schema({
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
    type: String,
    required: true,
    uppercase: true,
    trim: true
  }
});

// const consortiumSchema = new mongoose.Schema({
//   name: { type: String },
//   // fUnits: fUnitSchema,
//   balance_A: { type: Number },
//   balance_B: { type: Number },
//   balance: { type: Number }
// });

// const FUnit = mongoose.model('fUnit', fUnitSchema);

// const Consortium = mongoose.model('game', consortiumSchema);

// async function createConsortium(name, balance_A, balance_B, balance) {
//   const consortium = new Consortium({
//     name,
//     balance_A,
//     balance_B,
//     balance
//   });
//   const result = await consortium.save();
//   debug(result);
// }

// createConsortium('Jose Ingenieros 1840', 1, 2, 3);

// function validateExpense(expense) {
//   const schema = {
//     fUnit: Joi.number().required(),
//     floor: Joi.number()
//       .max(2)
//       .required(),
//     flat: Joi.string()
//       .min(1)
//       .max(2)
//       .required(),
//     share: Joi.number().required(),
//     landlord: Joi.string()
//       .min(1)
//       .required()
//   };

//   return Joi.validate(fUnit, schema);
// }

exports.Consortium = Consortium;
// exports.validate = validateFUnits;
