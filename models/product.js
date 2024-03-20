import { createClient } from '../client.js';

export const getProductCollection = async () => {
  const client = await createClient();
  const db = client.db('mdSportsWearDatabase');
  return db.collection('products');
};

export const createProduct = async ({ prodName, prodType, prodPrice, prodColor }) => {
  const productCollection = await getProductCollection();
  return await productCollection.insertOne({ prodName, prodType, prodPrice, prodColor });
};

export const findProducts = async () => {
  const productCollection = await getProductCollection();
  const products = await productCollection.find({}).toArray();
  return products;
};
