const request = require('supertest');
const app = require('../app');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Carts Router', () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should return a cart', async () => {
    const res = await request(app).get('/cart');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('products');
  });

  it('should add a product to the cart', async () => {
    const productId = 1;
    const res = await request(app).post('/cart').send({ productId });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('products');
    expect(res.body.products).to.include(productId);
  });

  it('should remove a product from the cart', async () => {
    const productId = 1;
    const res = await request(app).delete(`/cart/${productId}`);
    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
  });

  it('should update the cart', async () => {
    const cart = { products: [1, 2, 3] };
    const res = await request(app).put('/cart').send(cart);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('products');
    expect(res.body.products).to.deep.equal(cart.products);
  });
});