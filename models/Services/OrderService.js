const Order = require('../models/Order');
const Product = require('../models/Product');

class OrderService {
  async createOrder(req, res, next) {
    const { products, total } = req.body;
    const order = new Order({ products, total });
    await order.save();
    // Enviar correo de confirmación al cliente
    return res.json({ message: 'Order created successfully' });
  }

  async updateOrder(req, res, next) {
    const { id, status } = req.body;
    const order = await Order.findById(id);
    order.status = status;
    await order.save();
    return res.json({ message: 'Order updated successfully' });
  }
}

module.exports = OrderService;