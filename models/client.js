import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let _client = new MongoClient(process.env.MONGO_URL);
let isConnected = false;

export const createClient = async () => {
  if (!isConnected) {
    await _client.connect();
    isConnected = true;
  }
  return _client;
};
