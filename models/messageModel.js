const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Definición del esquema de mensajes
const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Definición del modelo de mensajes
const Message = mongoose.model('Message', messageSchema);

// Función para crear un nuevo mensaje
const createMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el mensaje' });
  }
};

// Función para obtener todos los mensajes
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los mensajes' });
  }
};

// Función para obtener un mensaje por ID
const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      res.status(404).json({ message: 'Mensaje no encontrado' });
    } else {
      res.status(200).json(message);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el mensaje' });
  }
};

// Función para actualizar un mensaje
const updateMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!message) {
      res.status(404).json({ message: 'Mensaje no encontrado' });
    } else {
      res.status(200).json(message);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el mensaje' });
  }
};

// Función para eliminar un mensaje
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndRemove(req.params.id);
    if (!message) {
      res.status(404).json({ message: 'Mensaje no encontrado' });
    } else {
      res.status(200).json({ message: 'Mensaje eliminado con éxito' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el mensaje' });
  }
};

// Exportación de las funciones
module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage
};