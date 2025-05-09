// index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const loginRoutes = require('../routes/loginRoute');  // Importamos las rutas de login
const registroRoutes = require('../routes/registerRoute');
const authenticateToken = require('../middlewares/auth');  // Middleware para la autenticación del token
const sequelize = require('../config/database');  // Importamos la configuración de la base de datos
const Usuario = require('../models/systemusers');  // Importamos directamente la función
const usuarioModelo = Usuario(sequelize, require('sequelize').DataTypes);  // Ejecutamos la función y obtenemos el modelo
console.log("Modelo Usuario en index.js:", Usuario); // Verifica que el modelo se cargue correctamente

// Crear la aplicación de Express
const app = express();

app.use(express.json());  // Para analizar las solicitudes con cuerpo JSON
app.use(cors());  // Habilitar CORS

// Configura el servidor HTTP para usar con Socket.io
const server = http.createServer(app);
const io = socketIo(server);

// Ruta básica
app.get('/', (req, res) => {
    res.send('¡Servidor de gestión de turnos en funcionamiento!');
    logToFile('Se visitó la ruta principal ("/")');
});

// Conexión WebSocket
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');
    logToFile('Un usuario se ha conectado');
    
    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
        logToFile('Un usuario se ha desconectado');
    });
});

// Rutas de login
app.use('/login', loginRoutes);
app.use('/register', registroRoutes);

// Ruta protegida (solo accesible si el token es válido)
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

// Configuración del puerto del servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    logToFile(`Servidor corriendo en http://localhost:${PORT}`);
});

// Función para escribir en el archivo de log
function logToFile(message) {
    const logMessage = `${new Date().toISOString()} - ${message}\n`; // Agrega la fecha y el mensaje
    fs.appendFile('logs.txt', logMessage, (err) => { // Escribe el mensaje en el archivo logs.txt
        if (err) {
            console.error('Error al escribir en el archivo de logs:', err); // Si hay un error, lo mostramos
        }
    });
}

// Verificación de la conexión con la base de datos
sequelize.authenticate()
    .then(() => {
        console.log('Conexión con la base de datos establecida correctamente.');
        logToFile('Conexión con la base de datos establecida correctamente.');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
        logToFile(`No se pudo conectar a la base de datos: ${err}`);
    });
