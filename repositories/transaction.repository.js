import { createClient } from '../client.js';

class TransactionRepository {
  client;
  db;
  collection;
  usersCollection;

  constructor() {
    this.init();
  }

  async init() {
    this.client = await createClient();
    this.db = this.client.db('mdSportsWearDatabase');
    this.collection = this.db.collection('transactions');
    this.usersCollection = this.db.collection('users');
  }

  async createTransaction({ customerId, inventoryId, date }) {
    if (!(await this.isPremiumUser(customerId))) {
      throw new Error('Only premium users can create transactions');
    }
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
    if (!(await this.isPremiumUser(customerId))) {
      throw new Error('Only premium users can update transactions');
    }
    try {
      await this.collection.updateOne({ _id: id }, { $set: { customerId, inventoryId, date } });
      return { customerId, inventoryId, date };
    } catch (error) {
      console.error(`Error updating transaction: ${error}`);
      throw error;
    }
  }

  async deleteTransaction(id) {
    if (!(await this.isPremiumUser(await this.getCustomerIdFromTransactionId(id)))) {
      throw new Error('Only premium users can delete transactions');
    }
    try {
      await this.collection.deleteOne({ _id: id });
      return `Transaction with id ${id} deleted successfully`;
    } catch (error) {
      console.error(`Error deleting transaction: ${error}`);
      throw error;
    }
  }
  
  async getCustomerIdFromTransactionId(id) {
    try {
      const transaction = await this.findTransactionById(id);
      return transaction.customerId;
    } catch (error) {
      console.error(`Error getting customer ID from transaction ID: ${error}`);
      throw error;
    }
  }

  async getUserRole(customerId) {
    try {
      const user = await this.usersCollection.findOne({ customerId });
      return user.role;
    } catch (error) {
      console.error(`Error getting user role: ${error}`);
      throw error;
    }
  }

  async updateUserRole(customerId, newRole) {
    try {
      await this.usersCollection.updateOne({ customerId }, { $set: { role: newRole } });
      return `User role updated successfully`;
    } catch (error) {
      console.error(`Error updating user role: ${error}`);
      throw error;
    }
  }

  async isPremiumUser(customerId) {
    try {
      const userRole = await this.getUserRole(customerId);
      return userRole === 'premium';
    } catch (error) {
      console.error(`Error checking if user is premium: ${error}`);
      throw error;
    }
  }
}

export const transactionRepository = new TransactionRepository();