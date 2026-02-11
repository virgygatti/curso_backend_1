# Proyecto Final - E-commerce Backend

Backend de un e-commerce con Node.js, Express, MongoDB (Mongoose), Handlebars y Socket.io. Incluye API REST para productos y carritos, vistas con paginación, detalle de producto, carrito con controles en la UI, y productos en tiempo real vía WebSocket.

## Requisitos

- Node.js (v18 o superior recomendado)
- MongoDB (local o [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

## Instalación

```bash
git clone <url-del-repositorio>
cd curso_backend_1
npm install
```

### Variables de entorno

Crear un archivo `.env` en la raíz (puedes copiar `.env.example`):

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.xxxxx.mongodb.net/backend1?retryWrites=true&w=majority
```

- **MongoDB Atlas:** crear cuenta, cluster M0 gratis, usuario de base de datos y obtener la connection string. En Network Access agregar tu IP o `0.0.0.0/0`.
- **Local:** por defecto se usa `mongodb://localhost:27017/backend1` si no defines `MONGODB_URI`.

Si MongoDB no está disponible, el servidor arranca igual (aviso en consola); la app usa persistencia en archivos hasta que la conexión exista.

## Scripts

| Comando       | Descripción                          |
|---------------|--------------------------------------|
| `npm start`   | Inicia el servidor (puerto 8080)     |
| `npm run dev` | Inicia con nodemon (recarga automática) |

## Estructura del proyecto

```
backend1/
├── src/
│   ├── config/
│   │   └── database.js      # Conexión MongoDB
│   ├── controllers/
│   │   ├── products.controller.js
│   │   └── carts.controller.js
│   ├── models/
│   │   ├── Product.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── products.routes.js
│   │   ├── carts.routes.js
│   │   └── views.routes.js
│   ├── services/
│   │   ├── productService.js
│   │   └── cartService.js
│   ├── utils/
│   │   └── fileManager.js
│   ├── app.js
│   └── server.js
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── index.handlebars           # Inicio (lista productos)
│   ├── realTimeProducts.handlebars
│   ├── products/
│   │   ├── index.handlebars       # Listado paginado
│   │   └── detail.handlebars
│   └── carts/
│       └── detail.handlebars
├── data/                          # JSON (Fase 1, ya no en uso con MongoDB)
├── .env
├── .env.example
└── package.json
```

## API - Endpoints

### Productos (`/api/products`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Listado con paginación. Query: `limit` (default 10), `page` (default 1), `query` (filtro categoría/disponibilidad), `sort` (`asc`/`desc` por precio). Respuesta: `{ status, payload, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink }` |
| GET | `/:pid` | Un producto por ID |
| POST | `/` | Crear producto. Body: `title`, `description`, `code`, `price`, `status` (opc., default true), `stock`, `category`, `thumbnails` (opc. array) |
| PUT | `/:pid` | Actualizar producto (no se actualiza el id) |
| DELETE | `/:pid` | Eliminar producto |

### Carritos (`/api/carts`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/` | Crear carrito. Respuesta: `{ id, products: [] }` |
| GET | `/:cid` | Carrito con productos poblados (populate) |
| POST | `/:cid/product/:pid` | Agregar producto al carrito (quantity +1 si ya existe) |
| PUT | `/:cid` | Actualizar carrito. Body: `{ products: [ { product: id, quantity: n }, ... ] }` |
| PUT | `/:cid/products/:pid` | Actualizar cantidad. Body: `{ quantity: n }` |
| DELETE | `/:cid/products/:pid` | Quitar un producto del carrito |
| DELETE | `/:cid` | Vaciar carrito (eliminar todos los productos) |

## Vistas (rutas en el navegador)

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio: lista de productos (render en servidor) |
| `/products` | Productos con paginación, filtros y orden. Enlace a detalle y botón "Agregar al carrito" |
| `/products/:pid` | Detalle de producto y botón agregar al carrito |
| `/carts/:cid` | Carrito: lista de productos (populate), actualizar cantidad y quitar producto |
| `/realtimeproducts` | Lista de productos en tiempo real (WebSocket); formulario crear y botón eliminar |

En la barra de navegación: **Crear carrito** (POST y redirección a `/carts/:id`; el ID se guarda en `localStorage` y se rellena al agregar productos).

## Tecnologías

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Handlebars** (vistas)
- **Socket.io** (tiempo real en `/realtimeproducts` y emisión tras crear/eliminar producto)
- **dotenv** (variables de entorno)

## Entregas realizadas

- **Fase 1:** Servidor, productos y carritos con persistencia en archivos JSON.
- **Fase 2:** Handlebars, vistas index y realTimeProducts, Socket.io (cliente conectado, lista por WebSocket, crear/eliminar producto con emit desde HTTP).
- **Fase 3:** MongoDB como persistencia principal, modelos Product/Cart, GET productos profesionalizado, nuevos endpoints de carritos, vistas con paginación/detalle/carrito y controles en la UI.

## Licencia

ISC
