const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

/**
 * GET /
 * Muestra la vista index.handlebars con la lista de productos (sin WebSocket).
 */
router.get('/', async (req, res, next) => {
  try {
    const products = await productService.getAll();
    res.render('index', {
      title: 'Inicio',
      products: products || []
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /realtimeproducts
 * Vista que recibe la lista de productos vía WebSocket (cliente conecta y servidor envía "products").
 */
router.get('/realtimeproducts', async (req, res, next) => {
  try {
    res.render('realTimeProducts', {
      title: 'Productos en tiempo real'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
