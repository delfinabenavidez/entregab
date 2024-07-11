import { createClient } from '../client.js';

class TransactionRepository {
  client;
  db;
  collection;

  constructor() {
    this.init();
  }

  async init() {
    this.client = await createClient();
    this.db = this.client.db('mdSportsWearDatabase');
    this.collection = this.db.collection('transactions');
  }

  async createTransaction({ customerId, inventoryId, date }) {
    try {
      await this.collection.insertOne({ customerId, inventoryId, date });
      return { customerId, inventoryId, date };
    } catch (error) {
      console.error(`Error creating transaction: ${error}`);
      throw error;
    }
  }

  async findTransactions() {
    try {
      const transactions = await this.collection.find({}).toArray();
      return transactions;
    } catch (error) {
      console.error(`Error finding transactions: ${error}`);
      throw error;
    }
  }

  async findTransactionById(id) {
    try {
      const transaction = await this.collection.findOne({ _id: id });
      return transaction;
    } catch (error) {
      console.error(`Error finding transaction by id: ${error}`);
      throw error;
    }
  }

  async updateTransaction(id, { customerId, inventoryId, date }) {
    try {
      await this.collection.updateOne({ _id: id }, { $set: { customerId, inventoryId, date } });
      return { customerId, inventoryId, date };
    } catch (error) {
      console.error(`Error updating transaction: ${error}`);
      throw error;
    }
  }

  async deleteTransaction(id) {
    try {
      await this.collection.deleteOne({ _id: id });
      return `Transaction with id ${id} deleted successfully`;
    } catch (error) {
      console.error(`Error deleting transaction: ${error}`);
      throw error;
    }
  }
}

export const transactionRepository = new TransactionRepository();