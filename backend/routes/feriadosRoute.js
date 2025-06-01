const express = require('express');
const router = express.Router();

// Importar conexión a la base de datos
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Importar y crear instancia del modelo
const AgendaFeriadosModel = require('../models/agendaferiados');
const AgendaFeriados = AgendaFeriadosModel(sequelize, DataTypes);

// Obtener todos los feriados
router.get('/', async (req, res) => {
    try {
        const feriados = await AgendaFeriados.findAll({ order: [['dia', 'ASC']] });
        res.json(feriados);
    } catch (err) {
        console.error('Error al obtener feriados:', err);
        res.status(500).json({ error: 'Error al obtener los feriados.' });
    }
});

// Agregar un nuevo feriado
router.post('/', async (req, res) => {
    const { dia, motivoferiado } = req.body;
    
    if (!dia || !motivoferiado?.trim()) {
        return res.status(400).json({ error: 'Datos incompletos.' });
    }

    try {
        const nuevo = await AgendaFeriados.create({
            dia,
            motivoferiado: motivoferiado.trim(),
        });
        res.status(201).json(nuevo);
    } catch (err) {
        console.error('Error al agregar feriado:', err);
        res.status(500).json({ error: 'Error al agregar feriado.' });
    }
});

// Eliminar feriado por fecha
router.delete('/:dia', async (req, res) => {
    const dia = req.params.dia;

    try {
        const eliminado = await AgendaFeriados.destroy({ where: { dia } });

        if (eliminado === 0) {
            return res.status(404).json({ error: 'Feriado no encontrado.' });
        }

        res.json({ mensaje: 'Feriado eliminado.' });
    } catch (err) {
        console.error('Error al eliminar feriado:', err);
        res.status(500).json({ error: 'Error al eliminar feriado.' });
    }
});

module.exports = router;
