const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/carts.controller');

// POST /api/carts/ - Crear nuevo carrito
router.post('/', cartsController.create);

// GET /api/carts/:cid - Listar productos del carrito
router.get('/:cid', cartsController.getById);

// POST /api/carts/:cid/product/:pid - Agregar producto al carrito
router.post('/:cid/product/:pid', cartsController.addProduct);

module.exports = router;
