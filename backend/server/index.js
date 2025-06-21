const express = require('express');
const http = require('http');
const cors = require('cors');
const { DataTypes } = require('sequelize');
const socketIo = require('socket.io');
const sequelize = require('../config/database');

// Modelos y lógica
const ChatMsgs = require('../models/chatmsgs')(sequelize, DataTypes);
const routes = require('../routes');
const authenticateToken = require('../middlewares/auth');
const handleSocket = require('../socket/socketHandler');

// Inicialización de Express y servidor HTTP
const app = express();
const server = http.createServer(app); // ✅ Crear el server primero

// Inicialización de Socket.IO
const io = socketIo(server, {
  cors: { origin: '*' }
});
handleSocket(io, ChatMsgs); // ✅ Manejar conexión WebSocket

// Middlewares
app.use(express.json());
app.use(cors());
app.use(authenticateToken);

// Ruta de prueba
app.get('/healthcheck', (req, res) => {
  res.send('¡Servidor de gestión de turnos en funcionamiento!');
});

// Mapeo de rutas base → nombre del archivo de ruta
const routeMap = {
  '/login': 'loginRoute',
  '/register': 'registerRoute',
  '/usuarios': 'usuariosRoute',
  '/contactos': 'contactosRoute',
  '/profesionales': 'profesionalesRoute',
  '/servicios': 'serviciosRoute',
  '/excepcionesProf': 'excepcionesRoute',
  '/agendas': 'feriadosRoute',
  '/agendaregular': 'agendaregularRoute',
  '/chat': 'chatRoute',
  '/ficha': 'fichaRoute',
  '/turnos': 'turnosRoute',
  '/roles': 'rolesRoute'
};

// Registro automático de rutas
Object.entries(routeMap).forEach(([base, routeName]) => {
  if (routes[routeName]) {
    app.use(base, routes[routeName]);
  } else {
    console.warn(`⚠️ Ruta no encontrada: ${routeName}`);
  }
});

// Conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión con la base de datos establecida correctamente.');
  })
  .catch(err => {
    console.error('❌ No se pudo conectar a la base de datos:', err);
    process.exit(1);
  });

// Puerto y arranque del servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Exportación para pruebas u otros usos
module.exports = { app, server };
