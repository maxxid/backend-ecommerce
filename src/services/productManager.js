const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    const data = await fs.readFile(this.path, 'utf8');
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const requiredFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
    if (!requiredFields.every(field => product.hasOwnProperty(field))) {
      throw new Error('Faltan campos requeridos');
    }

    const newProduct = { ...product, id: uuidv4() };
    const products = await this.getProducts();
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, data) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...data, id };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const newProducts = products.filter(p => p.id !== id);
    if (products.length === newProducts.length) return false;

    await fs.writeFile(this.path, JSON.stringify(newProducts, null, 2));
    return true;
  }
}

module.exports = ProductManager;
