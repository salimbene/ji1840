const mongoose = require('mongoose');
const Joi = require('joi');

const Expense = mongoose.model(
  'expense',
  mongoose.Schema({
    month: {},
    fUnit: { type: Number, required: true },
    expenses: {},
    payments: {},
    balance: { type: Number }
  })
);

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

exports.Expense = Expense;
// exports.validate = validateFUnits;
