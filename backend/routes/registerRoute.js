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
    const {
        nombre, apellido, docum, tipodoc, fechanacim, telcontacto, telemergencia,
        correo, direccion, contrasena
    } = req.body;

    const t = await sequelize.transaction();


    try {
        // Paso 1: Crear contacto
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
        console.log('Contacto creado con ID:', nuevoContacto.idcontacto);

        // Paso 2: Crear usuario asociado al contacto
        await SystemUsers.create({
            idcontacto: nuevoContacto.idcontacto,
            usuario: nuevoContacto.correo,
            contrasena, // se encripta en el hook
            rolpaciente: 1,
            rolmedico: 0,
            roladministrativo: 0,
            rolsuperadmin: 0
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });

    } catch (error) {
        await t.rollback();
        console.error('Error al registrar:', error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});

module.exports = router;
