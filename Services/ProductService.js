const Product = require('../models/Product');

class ProductService {
  async createMockProducts(req, res, next) {
    const products = [];
    for (let i = 0; i < 100; i++) {
      const product = new Product({
        name: `Product ${i}`,
        description: `This is product ${i}`,
        price: Math.random() * 100,
        stock: Math.floor(Math.random() * 10) + 1
      });
      products.push(product);
    }
    await Product.insertMany(products);
    return res.json({ message: 'Mock products created successfully' });
  }
}

module.exports = ProductService;