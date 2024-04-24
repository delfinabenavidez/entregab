import dotenv from 'dotenv';
import express from 'express';
import { ObjectId } from 'mongodb';
import { findCarts, findCartsById, updateCart } from './dao/cart.js';
import { createCustomer, findCustomers, findCustomersById, updateCustomer } from './dao/client.js';
import { createInventory, findInventory } from './dao/inventory.js';
import { createTransactions, findTransactions } from './dao/transactions.js';
import { messages } from './messages.js'; 
import { createProduct, findProducts } from './product.js';
import express from 'express';
import authRoutes from './authRoutes.js';
import { spawn } from 'child_process';

dotenv.config();


const app = express();
app.use('/auth', spawn('node', ['authRoutes.js']));


app.use(express.json());
app.use('/auth', authRoutes);
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});

app.get('/client/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    let client = await findCustomersById(id); 
    res.status(200).send(client);
  } catch (err) {
    res.status(500).send(messages.errorMessage); 
    console.log(err);
  }
});

app.patch('/client/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    let client = await updateCustomer(id, req.body); 
    res.status(200).send(client);
  } catch (err) {
    res.status(500).send(messages.errorMessage); 
    console.log(err);
  }
});

app.get('/client', async (req, res) => { 
  try {
    let client = await findCustomers();
    res.status(200).send(client);
  } catch (err) {
    res.status(500).send(messages.errorMessage); 
    console.log(err);
  }
});

app.post('/client', async (req, res) => {
  try {
    let client = await createCustomer(req.body);
    res.status(201).send(client);
  } catch (err) {
    res.status(500).send(messages.errorMessage); 
    console.log(err);
  }
});


app.get('/inventory/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    let inventory = await findInventory(id);
    res.status(200).send(inventory);
  } catch (err) {
    res.status(500).send(messages.errorMessage); 
    console.log(err);
  }
});

app.post('/inventory', async (req, res) => {
  try {
    let inventory = await createInventory(req.body);
    res.status(201).send(inventory);
  } catch (err) {
    res.status(500).send(messages.errorMessage); 
    console.log(err);
  }
});


app.get('/transactions', async (req, res) => {
  try {
    let transactions = await findTransactions();
    res.status(200).send(transactions);
  } catch (err) {
    res.status(500).send(messages.errorMessage); 
    console.log(err);
  }
});

app.post('/transactions', async (req, res) => {
  try {
    let transaction = await createTransactions(req.body);
    res.status(201).send(transaction);
  } catch (err) {
    res.status(500).send(messages.errorMessage); 
    console.log(err);
  }
});


app.get('/cart/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    let cart = await findCartsById(id);
    res.status(200).send(cart);
  } catch (err) {
    res.status(500).send(messages.errorMessage); 
    console.log(err);
  }
});

app.patch('/cart/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    let cart = await updateCart(id, req.body);
    res.status(200).send(cart);
  } catch (err) {
    res.status(500).send(messages.errorMessage); 
    console.log(err);
  }
});

app.get('/cart', async (req, res) => {
  try {
    let carts = await findCarts();
    res.status(200).send(carts);
  } catch (err) {
    res.status(500).send(messages.errorMessage); 
    console.log(err);
  }
});


app.get('/product', async (req, res) => {
  try {
    let product = await findProducts();
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send(messages.errorMessage); 
  }
});

app.post('/product', async (req, res) => {
  try {
    let product = await createProduct(req.body);
    res.status(201).send(product);
  } catch (err) {
    res.status(500).send(messages.errorMessage); 
    console.log(err);
  }
});

app.listen(3000, () => console.log('listening on port 3000'));
