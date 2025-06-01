const express = require('express');
const router = express.Router();

const sequelize = require('../config/database');
const ServiciosModel = require('../models/servicios');
const { DataTypes } = require('sequelize');
const Servicios = ServiciosModel(sequelize, DataTypes);

// GET /servicios - obtener listado completo
router.get('/', async (req, res) => {
    try {
        const servicios = await Servicios.findAll();
        res.json(servicios);
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({ message: 'Error al obtener los servicios' });
    }
});

// POST /servicios - crear nuevo servicio
router.post('/', async (req, res) => {
    const { nombre, activo, duracionturno } = req.body;
    const t = await sequelize.transaction();

    try {
        if (!nombre || duracionturno === undefined) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        const duracionInt = parseInt(duracionturno, 10);
        if (isNaN(duracionInt) || duracionInt <= 0) {
        return res.status(400).json({ message: 'Duración del turno debe ser un entero positivo' });
        }

        // Asegurar que activo sea booleano (por si viene como string)
        const activoBool = activo === true || activo === 'true' ? true : false;

        const nuevoServicio = await Servicios.create({
        nombre,
        activo: activoBool,
        duracionturno: duracionInt
        }, { transaction: t });

        await t.commit();
        res.status(201).json(nuevoServicio);

    } catch (error) {
        await t.rollback();
        console.error('Error al registrar servicio:', error);
        res.status(500).json({ message: 'Error al registrar el servicio' });
    }
});

// PUT /servicios/:id - actualizar servicio existente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, activo, duracionturno } = req.body;

    const t = await sequelize.transaction();

    try {
        if (!nombre || duracionturno === undefined) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        const duracionInt = parseInt(duracionturno, 10);
        if (isNaN(duracionInt) || duracionInt <= 0) {
        return res.status(400).json({ message: 'Duración del turno debe ser un entero positivo' });
        }

        const activoBool = activo === true || activo === 'true' ? true : false;

        const servicio = await Servicios.findByPk(id);
        if (!servicio) {
        await t.rollback();
        return res.status(404).json({ message: 'Servicio no encontrado' });
        }

        servicio.nombre = nombre;
        servicio.activo = activoBool;
        servicio.duracionturno = duracionInt;

        await servicio.save({ transaction: t });
        await t.commit();

        res.json(servicio);

    } catch (error) {
        await t.rollback();
        console.error('Error al actualizar servicio:', error);
        res.status(500).json({ message: 'Error al actualizar el servicio' });
    }
});

module.exports = router;
