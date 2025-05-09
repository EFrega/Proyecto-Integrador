// Importamos Express y creamos un router
const express = require('express');
const router = express.Router();

// Importamos la conexión a la base de datos
const sequelize = require('../config/database');

// Importamos los modelos Sequelize de SystemUsers y Contactos
const SystemUsersModel = require('../models/systemusers');
const ContactosModel = require('../models/contactos');

// Instanciamos los modelos pasando sequelize y DataTypes
const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);
const Contactos = ContactosModel(sequelize, require('sequelize').DataTypes);

// Ruta POST para registrar un nuevo usuario
router.post('/', async (req, res) => {
    // Extraemos los campos del cuerpo de la solicitud
    const {
        nombre, apellido, docum, tipodoc, fechanacim, telcontacto, telemergencia,
        correo, direccion, usuario, contrasena,
        rolpaciente, rolmedico, roladministrativo, rolsuperadmin
    } = req.body;

    // Creamos una transacción para asegurar que ambas inserciones se completen correctamente
    const t = await sequelize.transaction();

    try {
        // Paso 1: Creamos el contacto en la tabla Contactos
        const nuevoContacto = await Contactos.create({
            nombre,
            apellido,
            docum,
            tipodoc,
            fechanacim,
            telcontacto,
            telemergencia,
            correo,
            direccion
        }, { transaction: t });

        // Paso 2: Creamos el usuario en SystemUsers y vinculamos con el contacto creado
        await SystemUsers.create({
            idcontacto: nuevoContacto.idcontacto, // Clave foránea hacia Contactos
            usuario,
            contrasena, // Se encripta automáticamente por el hook definido en el modelo
            rolpaciente,
            rolmedico,
            roladministrativo,
            rolsuperadmin
        }, { transaction: t });

        // Si todo va bien, confirmamos la transacción
        await t.commit();

        // Devolvemos respuesta exitosa
        res.status(201).json({ message: 'Usuario registrado exitosamente' });

    } catch (error) {
        // Si algo falla, deshacemos la transacción
        await t.rollback();

        // Mostramos error en consola y respondemos con error 500
        console.error('Error al registrar:', error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});

// Exportamos el router para usarlo en index.js
module.exports = router;
