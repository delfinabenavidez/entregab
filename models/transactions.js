import { createClient } from '../client.js';

export const getTransactionCollection = async () => {
  const client = await createClient();
  const db = client.db('mdSportsWearDatabase');
  return db.collection('transactions');
};

export const createTransactions = async ({ customerId, inventoryId, date }) => {
  const transactionCollection = await getTransactionCollection();
  await transactionCollection.insertOne({ customerId, inventoryId, date });
  return { customerId, inventoryId, date };
};

export const findTransactions = async () => {
  const transactionCollection = await getTransactionCollection();
  const transactions = await transactionCollection.find({}).toArray();
  return transactions;
};
