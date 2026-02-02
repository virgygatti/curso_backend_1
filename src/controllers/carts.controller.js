const cartService = require('../services/cartService');

/**
 * POST /api/carts/
 * Crea un nuevo carrito. Estructura: { id, products: [] }
 */
async function create(req, res, next) {
  try {
    const cart = await cartService.create();
    res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/carts/:cid
 * Lista los productos que pertenecen al carrito con el cid proporcionado
 */
async function getById(req, res, next) {
  try {
    const { cid } = req.params;
    const cart = await cartService.getById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado', cid });
    }
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/carts/:cid/product/:pid
 * Agrega el producto al array "products" del carrito.
 * Formato: { product: "pid", quantity: 1 }. Si ya existe, incrementa quantity.
 */
async function addProduct(req, res, next) {
  try {
    const { cid, pid } = req.params;
    const result = await cartService.addProduct(cid, pid);
    if (result.error) {
      const status = result.error === 'Carrito no encontrado' ? 404 : 404;
      return res.status(status).json({ error: result.error });
    }
    res.status(200).json(result.cart);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  getById,
  addProduct
};
