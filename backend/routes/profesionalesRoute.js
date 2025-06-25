const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const SystemUsersModel = require('../models/systemusers');
const ProfesionalesModel = require('../models/profesionales');
const ContactosModel = require('../models/contactos');

const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);
const Profesionales = ProfesionalesModel(sequelize, require('sequelize').DataTypes);
const Contactos = ContactosModel(sequelize, require('sequelize').DataTypes);

//Asociación
Profesionales.belongsTo(Contactos, { foreignKey: 'idcontacto' });

// Actualizar estado del profesional según rolmedico
router.put('/actualizar-medico/:idusuario', async (req, res) => {
  const { idusuario } = req.params;
  const { rolmedico } = req.body;

  try {
    const usuario = await SystemUsers.findByPk(idusuario);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    const idcontacto = usuario.idcontacto;
    let profesional = await Profesionales.findOne({ where: { idcontacto } });

    if (rolmedico) {
      if (profesional) {
        await profesional.update({ activo: true });
      } else {
        await Profesionales.create({
          idcontacto,
          activo: true,
          matricula: '0'
        });
      }
    } else {
      if (profesional) {
        await profesional.update({ activo: false });
      }
    }

    res.json({ message: 'Profesional actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar profesional:', error);
    res.status(500).json({ message: 'Error en servidor' });
  }
});

// Obtener profesionales activos con nombre y apellido
router.get('/', async (req, res) => {
  try {
    const [result] = await sequelize.query(`
      SELECT p.idprofesional, p.matricula, c.nombre, c.apellido
      FROM Profesionales p
      JOIN Contactos c ON p.idcontacto = c.idcontacto
      WHERE p.activo <> 0
    `);
    res.json(result);
  } catch (error) {
    console.error('Error al obtener profesionales (raw):', error);
    res.status(500).json({ error: 'Error al obtener profesionales' });
  }
});

router.get('/por-servicio/:idservicio', async (req, res) => {
  const { idservicio } = req.params;

  try {
    const [result] = await sequelize.query(`
      SELECT p.idprofesional, p.matricula, c.nombre, c.apellido
      FROM Profesionales p
      JOIN Contactos c ON p.idcontacto = c.idcontacto
      JOIN ProfServicios ps ON ps.idprofesional = p.idprofesional
      WHERE ps.idservicio = ${idservicio}
      AND ps.activo <> 0
      AND p.activo <> 0
    `);

    res.json(result);
  } catch (error) {
    console.error('Error al obtener profesionales por servicio:', error);
    res.status(500).json({ error: 'Error al obtener profesionales por servicio' });
  }
});

module.exports = router;
