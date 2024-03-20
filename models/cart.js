import { createClient } from '../client.js';

export const getCartCollection = async () => {
  const client = await createClient();
  const db = client.db('mdSportsWearDatabase');
  return db.collection('carts');
};

export const createCart = async ({ totalPrice, itemsNum, customerID }) => {
  const cartCollection = await getCartCollection();
  const ret = await cartCollection.insertOne({ totalPrice, itemsNum, customerID });
  return ret;
};

export const findCarts = async () => {
  const cartCollection = await getCartCollection();
  const ret = await cartCollection.find({}).toArray();
  return ret;
};

export const findCartsById = async (id) => {
  const cartCollection = await getCartCollection();
  const ret = await cartCollection.findOne({ _id: id });
  return ret;
};

export const updateCart = async (id, { totalPrice, itemsNum, customerID }) => {
  const cartCollection = await getCartCollection();
  const ret = await cartCollection.updateOne({ _id: id }, { $set: { totalPrice, itemsNum, customerID } });
  return ret;
};

export const deleteCart = async (id) => {
  const cartCollection = await getCartCollection();
  const ret = await cartCollection.deleteOne({ _id: id });
  return ret;
};
