const express = require('express');
const router = express.Router();
const CartManager = require('../services/cartManager');
const ProductManager = require('../services/productManager');

const cartManager = new CartManager('data/carts.json');
const productManager = new ProductManager('data/products.json');

router.post('/', async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
});

router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const product = await productManager.getProductById(pid);
  if (!product) return res.status(404).json({ error: 'Producto no existe' });

  const updatedCart = await cartManager.addProductToCart(cid, pid);
  if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });

  res.json(updatedCart);
});

module.exports = router;
