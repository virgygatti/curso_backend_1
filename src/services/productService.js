const { readFile, writeFile } = require('../utils/fileManager');

const PRODUCTS_FILE = 'data/productos.json';

const REQUIRED_FIELDS = ['title', 'description', 'code', 'price', 'stock', 'category'];

/**
 * Genera un ID único para productos (numérico incremental)
 */
async function generateProductId() {
  const products = await readFile(PRODUCTS_FILE);
  if (!Array.isArray(products) || products.length === 0) return 1;
  const maxId = Math.max(...products.map((p) => (typeof p.id === 'number' ? p.id : parseInt(p.id, 10) || 0)));
  return maxId + 1;
}

/**
 * Valida que el cuerpo del producto tenga todos los campos obligatorios
 */
function validateProductBody(body) {
  const missing = REQUIRED_FIELDS.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');
  if (missing.length > 0) {
    return { valid: false, missing };
  }
  if (typeof body.price !== 'number' || body.price < 0) {
    return { valid: false, error: 'price debe ser un número mayor o igual a 0' };
  }
  if (typeof body.stock !== 'number' || body.stock < 0) {
    return { valid: false, error: 'stock debe ser un número mayor o igual a 0' };
  }
  return { valid: true };
}

/**
 * Obtiene todos los productos, opcionalmente limitados
 */
async function getAll(limit = undefined) {
  const products = await readFile(PRODUCTS_FILE);
  const list = Array.isArray(products) ? products : [];
  if (limit !== undefined && limit !== null) {
    const n = parseInt(limit, 10);
    if (!Number.isNaN(n) && n >= 0) return list.slice(0, n);
  }
  return list;
}

/**
 * Obtiene un producto por ID
 */
async function getById(pid) {
  const products = await readFile(PRODUCTS_FILE);
  const list = Array.isArray(products) ? products : [];
  const id = typeof pid === 'number' ? pid : parseInt(pid, 10);
  const product = list.find((p) => p.id === id || p.id === pid || String(p.id) === String(pid));
  return product || null;
}

/**
 * Crea un nuevo producto. El id no se envía en el body, se auto-genera.
 */
async function create(body) {
  const products = await readFile(PRODUCTS_FILE);
  const list = Array.isArray(products) ? [...products] : [];
  const id = await generateProductId();
  const product = {
    id,
    title: String(body.title),
    description: String(body.description),
    code: String(body.code),
    price: Number(body.price),
    status: body.status !== undefined ? Boolean(body.status) : true,
    stock: Number(body.stock),
    category: String(body.category),
    thumbnails: Array.isArray(body.thumbnails) ? body.thumbnails.map(String) : []
  };
  list.push(product);
  await writeFile(PRODUCTS_FILE, list);
  return product;
}

/**
 * Actualiza un producto por ID. El id NUNCA se actualiza.
 */
async function update(pid, body) {
  const products = await readFile(PRODUCTS_FILE);
  const list = Array.isArray(products) ? [...products] : [];
  const index = list.findIndex((p) => p.id == pid || String(p.id) === String(pid));
  if (index === -1) return null;
  const current = list[index];
  const allowed = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (key === 'price' || key === 'stock') current[key] = Number(body[key]);
      else if (key === 'status') current[key] = Boolean(body[key]);
      else if (key === 'thumbnails') current[key] = Array.isArray(body[key]) ? body[key].map(String) : [];
      else current[key] = String(body[key]);
    }
  }
  list[index] = current;
  await writeFile(PRODUCTS_FILE, list);
  return current;
}

/**
 * Elimina un producto por ID
 */
async function remove(pid) {
  const products = await readFile(PRODUCTS_FILE);
  const list = Array.isArray(products) ? [...products] : [];
  const index = list.findIndex((p) => p.id == pid || String(p.id) === String(pid));
  if (index === -1) return null;
  const [deleted] = list.splice(index, 1);
  await writeFile(PRODUCTS_FILE, list);
  return deleted;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  validateProductBody,
  generateProductId
};
