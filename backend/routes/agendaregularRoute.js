const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const AgendaModel = require('../models/agendaproregular');
const ProfServiciosModel = require('../models/profservicios');
const { DataTypes } = require('sequelize');

const AgendaProRegular = AgendaModel(sequelize, DataTypes);
const ProfServicios = ProfServiciosModel(sequelize, DataTypes);

router.post('/', async (req, res) => {
  const { agenda } = req.body;

  if (!Array.isArray(agenda) || agenda.length === 0) {
    return res.status(400).json({ message: 'No se recibieron bloques de agenda válidos.' });
  }

  const t = await sequelize.transaction();

  try {
    for (const bloque of agenda) {
      const { idprofesional, idservicio, ...horarios } = bloque;

      const [registro, creado] = await AgendaProRegular.findOrCreate({
        where: { idprofesional, idservicio },
        defaults: { ...horarios },
        transaction: t
      });

      if (!creado) {
        await registro.update({ ...horarios }, { transaction: t });
      }


            // Actualizar tabla ProfServicios
        await ProfServicios.findOrCreate({
          where: { idprofesional, idservicio },
          defaults: { activo: true },
          transaction: t
        });

    }

    await t.commit();
    res.json({ message: 'Agenda guardada correctamente' });
  } catch (error) {
    await t.rollback();
    console.error('Error al guardar agenda:', error);
    res.status(500).json({ message: 'Error al guardar agenda' });
  }
});

router.get('/:idprofesional', async (req, res) => {
  const { idprofesional } = req.params;
  try {
    const agenda = await AgendaProRegular.findAll({
      where: { idprofesional }
    });
    res.json(agenda);
  } catch (error) {
    console.error('Error al obtener agenda:', error);
    res.status(500).json({ message: 'Error al obtener la agenda' });
  }
});

router.delete('/:idprofesional/:idservicio', async (req, res) => {
  const { idprofesional, idservicio } = req.params;
  try {
    await AgendaProRegular.destroy({
      where: { idprofesional, idservicio }
    });
    await ProfServicios.destroy({
      where: { idprofesional, idservicio }
    });
    res.json({ message: 'Bloque eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar bloque:', error);
    res.status(500).json({ message: 'Error al eliminar bloque' });
  }
});

module.exports = router;
