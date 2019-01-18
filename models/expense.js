const mongoose = require('mongoose');
const Joi = require('joi');

const Expense = mongoose.model(
  'expense',
  mongoose.Schema({
    month: { type: Number },
    expenseTypeA: { type: Number },
    expenseTypeB: { type: Number }
  })
);

function validate(expense) {
  const schema = {
    month: Joi.number().required(),
    expenseTypeA: Joi.number().required(),
    expenseTypeB: Joi.number().required()
  };

  return Joi.validate(expense, schema);
}

exports.Expense = Expense;
exports.validate = validate;
