const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

class OrderService {
  async createOrder(req, res, next) {
    const { products, total } = req.body;
    const userId = req.user._id;
    const order = new Order({ products, total, user: userId });
    await order.save();
    // Enviar correo de confirmación al cliente
    return res.json({ message: 'Order created successfully' });
  }

  async updateOrder(req, res, next) {
    const { id, status } = req.body;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();
    return res.json({ message: 'Order updated successfully' });
  }

  async getOrders(req, res, next) {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId });
    return res.json(orders);
  }

  async getOrder(req, res, next) {
    const id = req.params.id;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json(order);
  }
}

module.exports = OrderService;