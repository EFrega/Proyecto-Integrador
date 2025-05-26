const express = require('express');
const router = express.Router();

// Conexión a la base de datos
const sequelize = require('../config/database');

// Importar y definir el modelo
const ServiciosModel = require('../models/servicios');
const Servicios = ServiciosModel(sequelize, require('sequelize').DataTypes);

// Ruta para crear un nuevo servicio
router.post('/', async (req, res) => {
    const { nombre, activo, duracionturno } = req.body;
    const t = await sequelize.transaction();

    try {
        if (!nombre || !duracionturno) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        const nuevoServicio = await Servicios.create({
            nombre,
            activo,
            duracionturno
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: 'Servicio registrado exitosamente', servicio: nuevoServicio });

    } catch (error) {
        await t.rollback();
        console.error('Error al registrar servicio:', error);
        res.status(500).json({ message: 'Error al registrar el servicio' });
    }
});

module.exports = router;
