import { createClient } from '../client.js';
import { ObjectId } from 'mongodb';

// Función para obtener la colección de inventario
export const getInventoryCollection = async () => {
  const client = await createClient();
  const db = client.db('mdSportsWearDatabase');
  return db.collection('inventory');
};

// Función para crear un nuevo documento en la colección de inventario
export const createInventory = async ({ prodName, prodType, prodPrice, prodColor }) => {
  const inventoryCollection = await getInventoryCollection();
  const result = await inventoryCollection.insertOne({ prodName, prodType, prodPrice, prodColor });
  return result.insertedId;
};

// Función para obtener todos los documentos de la colección de inventario
export const findInventory = async () => {
  const inventoryCollection = await getInventoryCollection();
  const inventory = await inventoryCollection.find({}).toArray();
  return inventory;
};

// Función para obtener un documento específico de la colección de inventario
export const findInventoryById = async (id) => {
  const inventoryCollection = await getInventoryCollection();
  const inventory = await inventoryCollection.findOne({ _id: new ObjectId(id) });
  return inventory;
};

// Función para actualizar un documento específico de la colección de inventario
export const updateInventory = async (id, { prodName, prodType, prodPrice, prodColor }) => {
  const inventoryCollection = await getInventoryCollection();
  const result = await inventoryCollection.updateOne({ _id: new ObjectId(id) }, { $set: { prodName, prodType, prodPrice, prodColor } });
  return result.modifiedCount;
};

// Función para eliminar un documento específico de la colección de inventario
export const deleteInventory = async (id) => {
  const inventoryCollection = await getInventoryCollection();
  const result = await inventoryCollection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount;
};