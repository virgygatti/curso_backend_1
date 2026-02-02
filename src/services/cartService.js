const { readFile, writeFile } = require('../utils/fileManager');
const { getById: getProductById } = require('./productService');

const CARTS_FILE = 'data/carrito.json';

/**
 * Genera un ID único para carritos (numérico incremental)
 */
async function generateCartId() {
  const carts = await readFile(CARTS_FILE);
  const list = Array.isArray(carts) ? carts : [];
  if (list.length === 0) return 1;
  const maxId = Math.max(...list.map((c) => (typeof c.id === 'number' ? c.id : parseInt(c.id, 10) || 0)));
  return maxId + 1;
}

/**
 * Obtiene todos los carritos (uso interno si hace falta)
 */
async function getAll() {
  const carts = await readFile(CARTS_FILE);
  return Array.isArray(carts) ? carts : [];
}

/**
 * Obtiene un carrito por ID
 */
async function getById(cid) {
  const carts = await readFile(CARTS_FILE);
  const list = Array.isArray(carts) ? carts : [];
  const cart = list.find((c) => c.id == cid || String(c.id) === String(cid));
  return cart || null;
}

/**
 * Crea un nuevo carrito. Estructura: { id, products: [] }
 */
async function create() {
  const carts = await readFile(CARTS_FILE);
  const list = Array.isArray(carts) ? [...carts] : [];
  const id = await generateCartId();
  const cart = { id, products: [] };
  list.push(cart);
  await writeFile(CARTS_FILE, list);
  return cart;
}

/**
 * Agrega un producto al carrito. Si ya existe, incrementa quantity.
 * Formato en array: { product: "pid", quantity: number }
 */
async function addProduct(cid, pid) {
  const carts = await readFile(CARTS_FILE);
  const list = Array.isArray(carts) ? [...carts] : [];
  const cartIndex = list.findIndex((c) => c.id == cid || String(c.id) === String(cid));
  if (cartIndex === -1) return { cart: null, error: 'Carrito no encontrado' };

  const product = await getProductById(pid);
  if (!product) return { cart: null, error: 'Producto no encontrado' };

  const cart = list[cartIndex];
  if (!Array.isArray(cart.products)) cart.products = [];
  const pidStr = String(pid);
  const existing = cart.products.find(
    (item) => String(item.product) === pidStr || item.product === pid
  );
  if (existing) {
    existing.quantity = (existing.quantity || 0) + 1;
  } else {
    cart.products.push({ product: pidStr, quantity: 1 });
  }
  list[cartIndex] = cart;
  await writeFile(CARTS_FILE, list);
  return { cart, error: null };
}

module.exports = {
  getAll,
  getById,
  create,
  addProduct,
  generateCartId
};
