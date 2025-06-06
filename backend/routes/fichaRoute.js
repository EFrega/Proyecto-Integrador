const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const FichaMedicaModel = require('../models/fichamedica');
const SystemUsersModel = require('../models/systemusers');
const ContactosModel = require('../models/contactos');

const FichaMedica = FichaMedicaModel(sequelize, require('sequelize').DataTypes);
const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);
const Contactos = ContactosModel(sequelize, require('sequelize').DataTypes);

// Obtener todos los contactos (para el buscador)
router.get('/', async (req, res) => {
  try {
    const contactos = await Contactos.findAll({
      attributes: ['idcontacto', 'nombre', 'apellido', 'documento'],
    });
    res.json(contactos);
    console.log('Contactos obtenidos:', contactos);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener contactos' });
  }
});

// Obtener ficha médica por ID de contacto
router.get('/:idcontacto', async (req, res) => {
  try {
    const ficha = await FichaMedica.findOne({ where: { idcontacto: req.params.idcontacto } });
    if (!ficha) return res.status(404).json({});
    res.json(ficha);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar ficha médica' });
  }
});

// Guardar o actualizar ficha médica
router.post('/', async (req, res) => {
  const { idusuario, idcontacto, gruposang, cobertura, histerenfmlia, observficha } = req.body;

  try {
    const user = await SystemUsers.findByPk(idusuario);
    if (!user) return res.status(403).json({ message: 'Usuario no autorizado' });

    const updateData = {};
    if (user.rolmedico || user.rolsuperadmin || user.roladministrativo) {
      updateData.gruposang = gruposang;
      updateData.cobertura = cobertura;
    }
    if (user.rolmedico) {
      updateData.histerenfmlia = histerenfmlia;
      updateData.observficha = observficha;
    }
    if (user.rolpaciente && user.idcontacto === idcontacto) {
      updateData.cobertura = cobertura;
    }

    const existingFicha = await FichaMedica.findOne({ where: { idcontacto } });

    if (existingFicha) {
      await existingFicha.update(updateData);
    } else {
      await FichaMedica.create({ idcontacto, ...updateData });
    }

    res.json({ message: 'Ficha médica guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar ficha médica:', error);
    res.status(500).json({ message: 'Error al guardar ficha médica' });
  }
});

module.exports = router;
