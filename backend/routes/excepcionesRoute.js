// routes/excepcionesRoute.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const AgendaProfExcepModel = require('../models/agendaprofexcep');
const AgendaProfExcep = AgendaProfExcepModel(sequelize, require('sequelize').DataTypes);
const { Op, fn, col, where } = require('sequelize');

// Obtener todas las excepciones
router.get('/', async (req, res) => {
  try {
    const lista = await AgendaProfExcep.findAll();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las excepciones' });
  }
});

// Agregar excepción
router.post('/', async (req, res) => {
  try {
    const nueva = await AgendaProfExcep.create(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    console.error('Error al crear excepción:', err);
    res.status(500).json({ error: 'Error al crear la excepción' });
  }
});

router.delete('/:idprofesional/:dia_inicio', async (req, res) => {
  const { idprofesional, dia_inicio } = req.params;
  try {
    const fechaTruncada = new Date(dia_inicio);
    fechaTruncada.setHours(0, 0, 0, 0);
    const eliminado = await AgendaProfExcep.destroy({
      where: {
        idprofesional,
        [Op.and]: [
          where(fn('DATE', col('dia_inicio')), dia_inicio)
        ]
      }
    });
    if (eliminado === 0) {
      console.warn(`No se eliminó nada: ${idprofesional} - ${dia_inicio}`);
    }
    res.json({ message: 'Excepción eliminada', eliminado })
  } catch (error) {
    console.error('Error al eliminar excepción:', error);
    res.status(500).json({ error: 'Error al eliminar la excepción' });
  }
});

router.put('/:idprofesional/:dia_inicio', async (req, res) => {
  const { idprofesional, dia_inicio } = req.params;
  const { dia_inicio: nuevoInicio, dia_fin } = req.body;

  // Validación de fechas
  if (dia_fin && nuevoInicio && new Date(dia_fin) < new Date(nuevoInicio)) {
    return res.status(400).json({ error: 'La fecha final no puede ser menor a la fecha de inicio.' });
  }

  try {
    const excep = await AgendaProfExcep.findOne({
      where: {
        idprofesional,
        [Op.and]: [
          where(fn('DATE', col('dia_inicio')), dia_inicio)
        ]
      }
    });

    if (!excep) {
      return res.status(404).json({ error: 'Excepción no encontrada' });
    }

    await excep.update(req.body);
    res.json({ message: 'Excepción actualizada' });
  } catch (error) {
    console.error('Error al actualizar excepción:', error);
    res.status(500).json({ error: 'Error al actualizar la excepción' });
  }
});

module.exports = router;
