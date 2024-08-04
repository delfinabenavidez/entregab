const Product = require('../models/product');
const User = require('../models/Users');

class ProductsController {
  async getAll(req, res) {
    const products = await Product.find();
    res.json(products);
  }

  async create(req, res) {
    const product = await Product.create(req.body);
    res.json(product);
  }

  async getById(req, res) {
    const product = await Product.findById(req.params.id);
    res.json(product);
  }
}

module.exports = ProductsController;