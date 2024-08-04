import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { createClient } from '../client.js';
import { User } from './models/user.js';
import { Role } from './models/role.js';

const dbName = 'Delf';
const usersCollection = 'users';
const rolesCollection = 'roles';

const client = createClient();
const db = client.db(dbName);
const users = db.collection(usersCollection);
const roles = db.collection(rolesCollection);

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
  const user = await users.findOne({ username });
  if (!user) {
    return done(null, false, { message: 'Credenciales incorrectas' });
  }
  if (user.password !== password) {
    return done(null, false, { message: 'Credenciales incorrectas' });
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await users.findOne({ _id: id });
  done(null, user);
});

const router = express.Router();

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), async (req, res) => {
  const user = req.user;
  const role = await roles.findOne({ _id: user.role });
  req.session.user = user;
  req.session.role = role;
  res.redirect('/dashboard');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

router.get('/dashboard', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  }
  const user = req.session.user;
  const role = req.session.role;
  res.render('dashboard', { user, role });
});

export default router;

