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
  excluded: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    }
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.model('expense', mongoose.Schema(expensesSchema));

async function getPeriodExpenses(period) {
  // userId = new ObjectId('5c5f833d1a2db7ad5ddeaeaf')
  debug(period);
  const total = await Expense.aggregate(
    [
      { $match: { period } },
      { $group: { _id: '$type', total: { $sum: '$ammount' } } }
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  ).then(results => results);
  return total;
}

function validateExpenses(expense) {
  const schema = {
    category: Joi.string().required(),
    concept: Joi.string().required(),
    type: Joi.string()
      .valid('A', 'B')
      .required(),
    ammount: Joi.number().required(),
    period: Joi.string().required(),
    excluded: Joi.array(),
    userId: Joi.ObjectId()
  };

  return Joi.validate(expense, schema);
}

exports.getPeriodExpenses = getPeriodExpenses;
exports.Expense = Expense;
exports.validate = validateExpenses;
