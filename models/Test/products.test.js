const request = require('supertest');
const app = require('../app');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Products Router', () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should return a list of products', async () => {
    const res = await request(app).get('/products');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.above(0);
  });

  it('should create a new product', async () => {
    const product = { name: 'New Product', price: 10.99 };
    const res = await request(app).post('/products').send(product);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.name).to.equal(product.name);
  });

  it('should return a product by ID', async () => {
    const productId = 1;
    const res = await request(app).get(`/products/${productId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id');
    expect(res.body.id).to.equal(productId);
  });

  it('should update a product', async () => {
    const productId = 1;
    const updatedProduct = { name: 'Updated Product', price: 12.99 };
    const res = await request(app).put(`/products/${productId}`).send(updatedProduct);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id');
    expect(res.body.name).to.equal(updatedProduct.name);
  });

  it('should delete a product', async () => {
    const productId = 1;
    const res = await request(app).delete(`/products/${productId}`);
    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
  });
});