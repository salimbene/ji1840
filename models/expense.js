const debug = require('debug')('models:expenses');
const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);

const mongoose = require('mongoose');

const expensesSchema = mongoose.Schema({
  concept: { type: String, trim: true, required: true },
  type: { type: String, enum: ['A', 'B'], default: 'A', required: true },
  category: { type: String, required: true },
  ammount: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  date: { type: Date, default: Date.now }
});

const paymentsSchema = mongoose.Schema({
  fUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'funits',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  ammount: { type: Number, required: true },
  comments: { type: String },
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.model(
  'expense',
  mongoose.Schema({
    month: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      required: true
    },
    year: { type: Number, required: true },
    eTypeA: { type: Number, default: 0 },
    eTypeB: { type: Number, default: 0 },
    expenses: [{ type: expensesSchema }],
    payments: [{ type: paymentsSchema }]
  })
);

function validateExpenses(expense) {
  debug(expense);
  const schema = {
    month: Joi.number().required(),
    year: Joi.number().required(),
    eTypeA: Joi.number(),
    eTypeB: Joi.number(),
    expenses: Joi.array().items(
      Joi.object().keys({
        concept: Joi.string().required(),
        type: Joi.string().required(),
        category: Joi.string().required(),
        user: Joi.ObjectId().required(),
        ammount: Joi.number().required()
      })
    ),
    payments: Joi.array().items(
      Joi.object().keys({
        fUnit: Joi.ObjectId().required(),
        user: Joi.ObjectId().required(),
        ammount: Joi.number().required(),
        comments: Joi.string().required()
      })
    )
  };

  return Joi.validate(expense, schema);
}

exports.Expense = Expense;
exports.validate = validateExpenses;
