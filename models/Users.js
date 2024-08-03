const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  documents: [
    {
      name: String,
      reference: String
    }
  ],
  last_connection: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateToken = function() {
  return jwt.sign({ userId: this._id, email: this.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
};

userSchema.methods.addToCart = async function(productId) {
  const cart = await Cart.findById(this.cartId);
  if (!cart) {
    const newCart = new Cart({ user: this._id, products: [productId] });
    await newCart.save();
    this.cartId = newCart._id;
    await this.save();
  } else {
    cart.products.push(productId);
    await cart.save();
  }
};

userSchema.methods.removeFromCart = async function(productId) {
  const cart = await Cart.findById(this.cartId);
  if (cart) {
    cart.products = cart.products.filter(product => product.toString() !== productId.toString());
    await cart.save();
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;