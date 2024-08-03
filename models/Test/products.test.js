const request = require('supertest');
const app = require('../app');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

describe('Products Router', () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should return a list of products', async () => {
    const user = await User.create({ email: 'test@example.com', password: 'password' });
    const token = await user.generateToken();
    const res = await request(app).get('/products').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.above(0);
  });

  it('should create a new product', async () => {
    const user = await User.create({ email: 'test@example.com', password: 'password' });
    const token = await user.generateToken();
    const product = { name: 'New Product', price: 10.99 };
    const res = await request(app).post('/products').set('Authorization', `Bearer ${token}`).send(product);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.name).to.equal(product.name);
  });

  it('should return a product by ID', async () => {
    const user = await User.create({ email: 'test@example.com', password: 'password' });
    const token = await user.generateToken();
    const product = await Product.create({ name: 'Test Product', price: 9.99 });
    const res = await request(app).get(`/products/${product.id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id');
    expect(res.body.id).to.equal(product.id);
  });
});