const debug = require('debug')('models:suppliers');
const mongoose = require('mongoose');

const supplierSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: Number, required: true, trim: true },
  contact: { type: Number, required: true, trim: true },
  comments: { type: String, trim: true }
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
