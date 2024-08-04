import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { sendEmail } from './emailService';

// Definición del esquema de producto
const productSchema = new mongoose.Schema({
  prodName: { type: String, required: true },
  prodType: { type: String, required: true },
  prodPrice: { type: Number, required: true },
  prodColor: { type: String, required: true }
});

// Definición del modelo de producto
const Product = mongoose.model('Product', productSchema);

// Definición del esquema de usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' }
});

// Definición del modelo de usuario
const User = mongoose.model('User', userSchema);

// Definición de la estrategia de autenticación local
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, (username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Usuario no encontrado' });
    if (!user.validPassword(password)) return done(null, false, { message: 'Contraseña incorrecta' });
    return done(null, user);
  });
}));

// Definición de la función para crear un producto
export const createProduct = async ({ prodName, prodType, prodPrice, prodColor }) => {
  const product = new Product({ prodName, prodType, prodPrice, prodColor });
  return await product.save();
};

// Definición de la función para encontrar productos
export const findProducts = async () => {
  return await Product.find({}).exec();
};

// Definición de la función para encontrar un producto por ID
export const findProductById = async (id) => {
  return await Product.findById(id).exec();
};

// Definición de la función para actualizar un producto
export const updateProduct = async (id, { prodName, prodType, prodPrice, prodColor }) => {
  return await Product.findByIdAndUpdate(id, { prodName, prodType, prodPrice, prodColor }, { new: true });
};

// Definición de la función para eliminar un producto
export const deleteProduct = async (id) => {
  return await Product.findByIdAndRemove(id);
};

// Definición de la función para crear un usuario
export const createUser = async ({ username, email, password }) => {
  const user = new User({ username, email, password });
  return await user.save();
};

// Definición de la función para encontrar un usuario por username
export const findUserByUsername = async (username) => {
  return await User.findOne({ username }).exec();
};

// Definición de la función para enviar un correo de confirmación
export const sendConfirmationEmail = async (user) => {
  const emailContent = `
    <h1>Confirmación de compra</h1>
    <p>Estimado/a ${user.username},</p>
    <p>Su compra ha sido realizada con éxito.</p>
    <p>Detalles de la compra:</p>
    <ul>
      <li>Producto: ${user.prodName}</li>
      <li>Precio: ${user.prodPrice}</li>
      <li>Color: ${user.prodColor}</li>
    </ul>
    <p>Gracias por su compra.</p>
  `;
  await sendEmail(user.email, 'Confirmación de compra', emailContent);
};

// Definición de la función para realizar una compra
export const makePurchase = async (user, product) => {
  const purchase = new Purchase({ user, product });
  await purchase.save();
  await sendConfirmationEmail(user);
  return purchase;
};

// Definición del esquema de compra
const purchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
});

// Definición del modelo de compra
const Purchase = mongoose.model('Purchase', purchaseSchema);