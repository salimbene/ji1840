const debug = require('debug')('models:expenses');
const mongoose = require('mongoose');

const expensesSchema = mongoose.Schema({
  category: { type: String, trim: true, required: true },
  concept: { type: String, trim: true, required: true },
  type: { type: String, enum: ['A', 'B'], default: 'A', required: true },
  ammount: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  period: { type: Date, default: Date.now },
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.model('expense', mongoose.Schema(expensesSchema));

function validateExpenses(expense) {
  debug(expense);
  const schema = {
    category: Joi.string()
      .allow('')
      .required(),
    concept: Joi.string()
      .allow('')
      .required(),
    type: Joi.string().required(),
    ammount: Joi.number().required(),
    user: Joi.object().keys({
      userId: Joi.ObjectId(),
      name: Joi.string()
    }),
    period: Joi.date()
  };

  return Joi.validate(expense, schema);
}

exports.Expense = Expense;
exports.validate = validateExpenses;
