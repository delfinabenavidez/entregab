const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  permissions: [
    {
      type: String,
      enum: ['CREATE', 'READ', 'UPDATE', 'DELETE']
    }
  ]
});

roleSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('name')) {
    const existingRole = await Role.findOne({ name: this.name });
    if (existingRole) {
      throw new Error(`El rol ${this.name} ya existe`);
    }
  }
  next();
});

const Role = mongoose.model('Role', roleSchema);

// Métodos adicionales para el modelo de rol
Role.prototype.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

Role.prototype.addPermission = function(permission) {
  if (!this.hasPermission(permission)) {
    this.permissions.push(permission);
  }
};

Role.prototype.removePermission = function(permission) {
  const index = this.permissions.indexOf(permission);
  if (index !== -1) {
    this.permissions.splice(index, 1);
  }
};

module.exports = Role;