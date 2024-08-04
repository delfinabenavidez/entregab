const request = require('supertest');
const app = require('../app');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const User = require('../models/User');
const Session = require('../models/Session');
const Role = require('../models/Role');
const passport = require('passport');

describe('Sessions Router', () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a new session', async () => {
    const user = new User({ username: 'johnDoe', password: 'password123' });
    await user.save();
    const res = await request(app).post('/sessions').send({ username: 'johnDoe', password: 'password123' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('token');
    const token = res.body.token;
    const session = await Session.findOne({ token });
    expect(session).to.exist;
    expect(session.user).to.equal(user._id);
  });

  it('should return a session by token', async () => {
    const user = new User({ username: 'johnDoe', password: 'password123' });
    await user.save();
    const session = new Session({ user: user._id, token: 'valid-token' });
    await session.save();
    const res = await request(app).get(`/sessions/${session.token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('user');
    expect(res.body.user).to.equal(user._id);
  });

  it('should delete a session', async () => {
    const user = new User({ username: 'johnDoe', password: 'password123' });
    await user.save();
    const session = new Session({ user: user._id, token: 'valid-token' });
    await session.save();
    const res = await request(app).delete(`/sessions/${session.token}`);
    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
    const deletedSession = await Session.findOne({ token: session.token });
    expect(deletedSession).to.not.exist;
  });

  it('should authenticate user with valid credentials', async () => {
    const user = new User({ username: 'johnDoe', password: 'password123' });
    await user.save();
    const res = await request(app).post('/sessions').send({ username: 'johnDoe', password: 'password123' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('token');
  });

  it('should not authenticate user with invalid credentials', async () => {
    const user = new User({ username: 'johnDoe', password: 'password123' });
    await user.save();
    const res = await request(app).post('/sessions').send({ username: 'johnDoe', password: 'wrongpassword' });
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('error');
  });

  it('should assign role to user', async () => {
    const user = new User({ username: 'johnDoe', password: 'password123' });
    await user.save();
    const role = new Role({ name: 'admin' });
    await role.save();
    user.roles.push(role._id);
    await user.save();
    const res = await request(app).get(`/users/${user._id}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('roles');
    expect(res.body.roles).to.include(role._id);
  });
});