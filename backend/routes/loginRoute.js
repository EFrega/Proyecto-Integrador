const express = require('express');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');  // Importamos la instancia de sequelize
const Usuario = require('../models/systemusers');  // Importamos directamente la función
const usuarioModelo = Usuario(sequelize, require('sequelize').DataTypes);  // Ejecutamos la función y obtenemos el modelo
const Contactos = require('../models/contactos')(sequelize, require('sequelize').DataTypes);
const Profesionales = require('../models/profesionales')(sequelize, require('sequelize').DataTypes);
console.log("Modelo Usuario en loginRoute:", Usuario); // Esto debería mostrar el modelo o undefined
const router = express.Router();

// Ruta para el login
router.post('/', async (req, res) => {
    console.log('Datos recibidos en el login:', req.body); // Muestra los datos del cuerpo de la solicitud
    const { usuario, contrasena } = req.body;

    try {
        console.log("Intentando encontrar el usuario en la base de datos...");
        const usuarioDb = await usuarioModelo.findOne({ where: { usuario } });
        console.log('Usuario encontrado:', usuarioDb); // Aquí vemos si el usuario se encuentra correctamente

        if (!usuarioDb) {
            console.log("No existe el usuario");
            return res.status(401).json({ message: 'No existe el usuario' });
        }

        // Comparamos la contraseña proporcionada con la almacenada en la base de datos
        console.log("Comparando contraseñas...");
        const isMatch = await usuarioDb.comparePassword(contrasena);
        console.log('¿Las contraseñas coinciden?', isMatch); // Verifica si el valor es true o false

        if (!isMatch) {
            console.log("Credenciales incorrectas");
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Generamos el token JWT usando variable de entorno
        console.log("Generando el token...");
        const jwtSecret = process.env.JWT_SECRET || 'secreto';
        const token = jwt.sign(
            { id: usuarioDb.idUsuario, usuario: usuarioDb.usuario },
            jwtSecret, // Usar variable de entorno
            { expiresIn: '1h' }  // El token expira en una hora
        );

        const contacto = await Contactos.findByPk(usuarioDb.idcontacto);
        console.log('Token generado:', token);
        let idprofesional = null;

        if (usuarioDb.rolmedico) {
            const profesional = await Profesionales.findOne({
                where: { idcontacto: usuarioDb.idcontacto }
            });

            if (profesional) {
                idprofesional = profesional.idprofesional;
            }
        }
        res.json({
            token,
            idusuario: usuarioDb.idusuario,
            idcontacto: usuarioDb.idcontacto,
            idprofesional, // se incluye aunque sea null
            nombre: contacto?.nombre || '',
            apellido: contacto?.apellido || '',
            usuario: usuarioDb.usuario,
            roles: {
                rolpaciente: usuarioDb.rolpaciente,
                rolmedico: usuarioDb.rolmedico,
                roladministrativo: usuarioDb.roladministrativo,
                rolsuperadmin: usuarioDb.rolsuperadmin
            }
        });
    } catch (err) {
        console.log("Error en el catch de loginRoute:", err); // Agregamos un log para mostrar el error exacto
        res.status(500).json({ message: 'Error en el servidoor' });
    }
});

module.exports = router;