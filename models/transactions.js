import { createClient } from '../client.js';

class TransactionRepository {
  async getCollection() {
    const client = await createClient();
    const db = client.db('mdSportsWearDatabase');
    return db.collection('transactions');
  }

  async createTransaction({ customerId, inventoryId, date }) {
    const collection = await this.getCollection();
    await collection.insertOne({ customerId, inventoryId, date });
    return { customerId, inventoryId, date };
  }

  async findTransactions() {
    const collection = await this.getCollection();
    const transactions = await collection.find({}).toArray();
    return transactions;
  }
}

export const transactionRepository = new TransactionRepository();