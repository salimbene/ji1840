const debug = require('debug')('models:suppliers');
const Joi = require('joi');
const mongoose = require('mongoose');

const supplierSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  comments: { type: String, trim: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  date: { type: Date, default: Date.now }
});

const Supplier = mongoose.model('supplier', mongoose.Schema(supplierSchema));

function validateSupplier(supplier) {
  const schema = {
    name: Joi.string().required(),
    category: Joi.string().required(),
    contact: Joi.string().required(),
    comments: Joi.string().allow('')
  };

  return Joi.validate(supplier, schema);
}

exports.Supplier = Supplier;
exports.validate = validateSupplier;
