import { createClient } from '../client.js';
import express from 'express';
import { login } from './models/auth.js';

const dbName = 'Delf'; 

export const login = async (username, password) => {
  const client = await createClient();
  const db = client.db(dbName);
  const usersCollection = db.collection('Delf'); 

  const user = await usersCollection.findOne({ username, password });

  if (user) {
    return { success: true, message: 'Inicio de sesión exitoso' };
  } else {
    return { success: false, message: 'Credenciales incorrectas' };
  }
};

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await login(username, password);
  if (result.success) {
    res.status(200).send(result.message);
  } else {
    res.status(401).send(result.message);
  }
});

export default router;

