const mongoose = require('mongoose');
const Product = require('./productModel');
const User = require('./userModel');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;