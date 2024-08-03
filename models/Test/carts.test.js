// carts.test.js
const request = require('supertest');
const app = require('../app');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');
const passport = require('passport');

describe('Carts Router', () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should return a cart', async () => {
    const user = await User.create({ email: 'test@example.com', password: 'password' });
    const cart = await Cart.create({ user: user._id });
    const res = await request(app).get('/cart').set("Authorization", `Bearer ${user.generateToken()}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('products');
  });

  it('should add a product to the cart', async () => {
    const user = await User.create({ email: 'test@example.com', password: 'password' });
    const product = await Product.create({ name: 'Test Product', price: 10.99 });
    const cart = await Cart.create({ user: user._id });
    const res = await request(app).post('/cart').send({ productId: product._id }).set("Authorization", `Bearer ${user.generateToken()}`);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('products');
    expect(res.body.products).to.include(product._id.toString());
  });

  it('should remove a product from the cart', async () => {
    const user = await User.create({ email: 'test@example.com', password: 'password' });
    const product = await Product.create({ name: 'Test Product', price: 10.99 });
    const cart = await Cart.create({ user: user._id, products: [product._id] });
    const res = await request(app).delete(`/cart/${product._id}`).set("Authorization", `Bearer ${user.generateToken()}`);
    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
  });

  it('should send a confirmation email after completing the purchase', async () => {
    const user = await User.create({ email: 'test@example.com', password: 'password' });
    const product = await Product.create({ name: 'Test Product', price: 10.99 });
    const cart = await Cart.create({ user: user._id, products: [product._id] });
    const res = await request(app).post('/cart/checkout').set("Authorization", `Bearer ${user.generateToken()}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Purchase completed successfully');
  });
});