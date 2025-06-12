// index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const sequelize = require('../config/database');

const ChatMsgs = require('../models/chatmsgs')(sequelize, require('sequelize').DataTypes);
const Usuario = require('../models/systemusers');
const usuarioModelo = Usuario(sequelize, require('sequelize').DataTypes);

const loginRoutes = require('../routes/loginRoute');
const registerRoutes = require('../routes/registerRoute');
const usuariosRoutes = require('../routes/usuariosRoute');
const contactosRoutes = require('../routes/contactosRoute');
const profesionalesRoute = require('../routes/profesionalesRoute');
const serviciosRoutes = require('../routes/serviciosRoute');
const excepcionesRoute = require('../routes/excepcionesRoute');
const feriadosRoutes = require('../routes/feriadosRoute');
const agendaRegularRoutes = require('../routes/agendaregularRoute');
const fichaRoute = require('../routes/fichaRoute');
const chatRoute = require('../routes/chatRoute');
const turnosRoute = require('../routes/turnosRoute');

const authenticateToken = require('../middlewares/auth');

// 🟢 Inicialización de Express y servidor HTTP
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {

    cors: {
        origin: '*',
    }
});

// Middlewares
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {

    res.send('¡Servidor de gestión de turnos en funcionamiento!');
});

// WebSocket
io.on('connection', socket => {

    console.log('🟢 Cliente conectado:', socket.id);

    socket.on('enviar-mensaje', async (msg) => {
        try {
        const nuevo = await ChatMsgs.create({
            idchat: msg.idchat,
            idsystemuseremisor: msg.idsystemuseremisor,
            msgtexto: msg.msgtexto,
            msgtimesent: msg.msgtimesent || new Date(),
            msgstatus: 1 // asumimos "pendiente"
        });

        io.emit('nuevo-mensaje', nuevo); // reenvía a todos
        } catch (error) {
        console.error('❌ Error al guardar mensaje:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado:', socket.id);
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
app.use('/agendaregular', agendaRegularRoutes);
app.use('/chat', chatRoute);
app.use('/ficha', fichaRoute);
app.use('/turnos', turnosRoute);

// Ruta protegida
app.get('/usuarios/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await usuarioModelo.findOne({ where: { idUsuario: id } });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.json(usuario);
    } catch (err) {
        return res.status(500).json({ error: 'Error en el servidor', detalle: err.message });
    }
});

// Conexión a la base de datos
sequelize.authenticate()

    .then(() => {
        console.log('Conexión con la base de datos establecida correctamente.');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });

// Puerto y arranque
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {

    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Exportación para otros módulos si es necesario
module.exports = { app, server };