const mockingProducts = [];

for (let i = 0; i < 100; i++) {
  const product = {
    _id: `product-${i}`,
    name: `Product ${i}`,
    description: `This is product ${i}`,
    price: Math.random() *  * 100,
    stock: Math.floor(Math.random() * 10) + 1
  };
  mockingProducts.push(product);
}

module.exports = {
  getMockingProducts: () => mockingProducts
};