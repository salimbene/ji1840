const debug = require('debug')('models:expenses');
const Joi = require('joi');
const mongoose = require('mongoose');

const expensesSchema = mongoose.Schema({
  category: { type: String, trim: true, required: true },
  concept: { type: String, trim: true, required: true },
  type: {
    type: String,
    enum: ['A', 'B'],
    default: 'A',
    uppercase: true,
    required: true
  },
  ammount: { type: Number, required: true },
  period: { type: String, trim: true, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.model('expense', mongoose.Schema(expensesSchema));

function validateExpenses(expense) {
  const schema = {
    category: Joi.string().required(),
    concept: Joi.string().required(),
    type: Joi.string()
      .valid('A', 'B')
      .required(),
    ammount: Joi.number().required(),
    period: Joi.string().required(),
    userId: Joi.ObjectId()
  };

  return Joi.validate(expense, schema);
}

exports.Expense = Expense;
exports.validate = validateExpenses;
