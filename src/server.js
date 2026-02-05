const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const productService = require('./services/productService');

const PORT = 8080;

const server = http.createServer(app);

const io = new Server(server);

// Exponer io en la app para usarlo en controladores (emit dentro de POST/DELETE)
app.set('io', io);

io.on('connection', async (socket) => {
  console.log('cliente conectado');
  try {
    const products = await productService.getAll();
    socket.emit('products', products);
  } catch (err) {
    console.error('Error al enviar productos por WebSocket:', err);
    socket.emit('products', []);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
