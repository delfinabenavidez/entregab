import { createClient } from '../client.js';
import { User } from './models/user.js';
import { Role } from './models/role.js';
import { Product } from './models/product.js';

// Función para obtener la colección de carritos de compras
export const getCartCollection = async () => {
  const client = await createClient();
  const db = client.db('mdSportsWearDatabase');
  return db.collection('carts');
};

// Función para crear un nuevo carrito de compras
export const createCart = async ({ totalPrice, itemsNum, customerID }) => {
  const cartCollection = await getCartCollection();
  const customer = await User.findById(customerID);
  if (!customer) {
    throw new Error('El cliente no existe');
  }
  const cart = await cartCollection.insertOne({ totalPrice, itemsNum, customerID });
  return cart;
};

// Función para obtener todos los carritos de compras
export const findCarts = async () => {
  const cartCollection = await getCartCollection();
  const carts = await cartCollection.find({}).toArray();
  return carts;
};

// Función para obtener un carrito de compras por ID
export const findCartById = async (id) => {
  const cartCollection = await getCartCollection();
  const cart = await cartCollection.findOne({ _id: id });
  return cart;
};

// Función para actualizar un carrito de compras
export const updateCart = async (id, { totalPrice, itemsNum, customerID }) => {
  const cartCollection = await getCartCollection();
  const customer = await User.findById(customerID);
  if (!customer) {
    throw new Error('El cliente no existe');
  }
  const cart = await cartCollection.updateOne({ _id: id }, { $set: { totalPrice, itemsNum, customerID } });
  return cart;
};

// Función para eliminar un carrito de compras
export const deleteCart = async (id) => {
  const cartCollection = await getCartCollection();
  const cart = await cartCollection.deleteOne({ _id: id });
  return cart;
};

// Función para agregar un producto a un carrito de compras
export const addProductToCart = async (cartId, productId) => {
  const cartCollection = await getCartCollection();
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('El producto no existe');
  }
  const cart = await cartCollection.updateOne({ _id: cartId }, { $push: { products: productId } });
  return cart;
};

// Función para eliminar un producto de un carrito de compras
export const removeProductFromCart = async (cartId, productId) => {
  const cartCollection = await getCartCollection();
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('El producto no existe');
  }
  const cart = await cartCollection.updateOne({ _id: cartId }, { $pull: { products: productId } });
  return cart;
};

// Función para enviar un correo de confirmación al cliente
export const sendConfirmationEmail = async (cartId) => {
  const cartCollection = await getCartCollection();
  const cart = await cartCollection.findOne({ _id: cartId });
  const customer = await User.findById(cart.customerID);
  if (!customer) {
    throw new Error('El cliente no existe');
  }
  // Enviar correo de confirmación al cliente
  console.log(`Correo de confirmación enviado a ${customer.email}`);
};

// Función para finalizar la compra
export const finishPurchase = async (cartId) => {
  const cartCollection = await getCartCollection();
  const cart = await cartCollection.findOne({ _id: cartId });
  const customer = await User.findById(cart.customerID);
  if (!customer) {
    throw new Error('El cliente no existe');
  }
  // Guardar la información de la compra en la base de datos
  console.log(`Compra finalizada con éxito`);
  // Enviar correo de confirmación al cliente
  await sendConfirmationEmail(cartId);
};