// index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const sequelize = require('../config/database');

const loginRoutes = require('../routes/loginRoute');
const registerRoutes = require('../routes/registerRoute');
const usuariosRoutes = require('../routes/usuariosRoute');
const contactosRoutes = require('../routes/contactosRoute');
const profesionalesRoute = require('../routes/profesionalesRoute');
const serviciosRoutes = require('../routes/serviciosRoute');
const excepcionesRoute = require('../routes/excepcionesRoute');
const feriadosRoutes = require('../routes/feriadosRoute');

const authenticateToken = require('../middlewares/auth');
const Usuario = require('../models/systemusers');
const usuarioModelo = Usuario(sequelize, require('sequelize').DataTypes);

console.log("Modelo Usuario en index.js:", Usuario);

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(cors());

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Servidor de gestión de turnos en funcionamiento!');
    logToFile('Se visitó la ruta principal ("/")');
});

// WebSocket
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');
    logToFile('Un usuario se ha conectado');

    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
        logToFile('Un usuario se ha desconectado');
    });
});

// Rutas principales
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/contactos', contactosRoutes);
app.use('/profesionales', profesionalesRoute);
app.use('/servicios', serviciosRoutes);
app.use('/excepcionesProf', excepcionesRoute);
app.use('/agendas', feriadosRoutes);

// Ruta protegida de ejemplo
app.get('/usuarios/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await usuarioModelo.findOne({ where: { idUsuario: id } });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (err) {
        return res.status(500).send('Error en el servidooor');
    }
});

// Puerto
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    logToFile(`Servidor corriendo en http://localhost:${PORT}`);
});

// Logging
function logToFile(message) {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFile('logs.txt', logMessage, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de logs:', err);
        }
    });
}

// Conexión a la base de datos
sequelize.authenticate()
    .then(() => {
        console.log('Conexión con la base de datos establecida correctamente.');
        logToFile('Conexión con la base de datos establecida correctamente.');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
        logToFile(`No se pudo conectar a la base de datos: ${err}`);
    });

    module.exports = { app, server };