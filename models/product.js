import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  prodName: { type: String, required: true },
  prodType: { type: String, required: true },
  prodPrice: { type: Number, required: true },
  prodColor: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

export const createProduct = async ({ prodName, prodType, prodPrice, prodColor }) => {
  const product = new Product({ prodName, prodType, prodPrice, prodColor });
  return await product.save();
};

export const findProducts = async () => {
  return await Product.find({}).exec();
};

export const findProductById = async (id) => {
  return await Product.findById(id).exec();
};

export const updateProduct = async (id, { prodName, prodType, prodPrice, prodColor }) => {
  return await Product.findByIdAndUpdate(id, { prodName, prodType, prodPrice, prodColor }, { new: true });
};

export const deleteProduct = async (id) => {
  return await Product.findByIdAndRemove(id);
};