import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let _client = new MongoClient(process.env.MONGO_URL);
let isConnected = false;

export const createClient = async () => {
  if (!isConnected) {
    try {
      await _client.connect();
      isConnected = true;
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
      throw error;
    }
  }
  return _client;
};

export const closeClient = async () => {
  if (isConnected) {
    try {
      await _client.close();
      isConnected = false;
    } catch (error) {
      console.error('Error al cerrar la conexión a la base de datos:', error);
      throw error;
    }
  }
};

export const getClient = () => {
  if (!isConnected) {
    throw new Error('No se ha establecido la conexión a la base de datos');
  }
  return _client;
};

export const getDatabase = async () => {
  const client = await createClient();
  return client.db();
};

export const getCollection = async (collectionName) => {
  const db = await getDatabase();
  return db.collection(collectionName);
};