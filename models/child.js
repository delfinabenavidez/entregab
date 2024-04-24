import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './authRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

app.listen(3001, () => {
  console.log('Child process listening on port 3001');
});