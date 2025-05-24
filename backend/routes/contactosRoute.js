const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const ContactosModel = require('../models/contactos');
const SystemUsersModel = require('../models/systemusers');

const Contactos = ContactosModel(sequelize, require('sequelize').DataTypes);
const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);

// Obtener contacto por ID de usuario
router.get('/:idusuario', async (req, res) => {
  const { idusuario } = req.params;

  try {
    const usuario = await SystemUsers.findByPk(idusuario);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    const contacto = await Contactos.findByPk(usuario.idcontacto);
    if (!contacto) return res.status(404).json({ message: 'Contacto no encontrado' });

    res.json(contacto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener contacto' });
  }
});

// Actualizar contacto
router.put('/:idcontacto', async (req, res) => {
  const { idcontacto } = req.params;
  const {
    nombre,
    apellido,
    docum,
    tipodoc,
    fechanacim,
    telcontacto,
    telemergencia,
    correo,
    direccion
  } = req.body;

  try {
    const contacto = await Contactos.findByPk(idcontacto);
    if (!contacto) return res.status(404).json({ message: 'Contacto no encontrado' });

    await contacto.update({
      nombre,
      apellido,
      docum,
      tipodoc,
      fechanacim,
      telcontacto,
      telemergencia,
      correo,
      direccion
    });

    res.json({ message: 'Contacto actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar contacto' });
  }
});

module.exports = router;
