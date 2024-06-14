const request = require('supertest');
const app = require('../app');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Sessions Router', () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a new session', async () => {
    const user = { username: 'johnDoe', password: 'password123' };
    const res = await request(app).post('/sessions').send(user);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('token');
  });

  it('should return a session by token', async () => {
    const token = 'valid-token';
    const res = await request(app).get(`/sessions/${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('user');
  });

  it('should delete a session', async () => {
    const token = 'valid-token';
    const res = await request(app).delete(`/sessions/${token}`);
    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
  });
});