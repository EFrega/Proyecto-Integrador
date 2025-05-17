const express = require('express');
const router = express.Router();

const sequelize = require('../config/database');
const SystemUsersModel = require('../models/systemusers');
const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);

// Obtener todos los usuarios con campos clave
router.get('/', async (req, res) => {
  try {
    const usuarios = await SystemUsers.findAll({
      attributes: ['idusuario', 'usuario', 'rolpaciente', 'rolmedico', 'roladministrativo', 'rolsuperadmin']
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Actualizar los roles rolsuperadmin
router.put('/roles', async (req, res) => {
  const { usuarios } = req.body;

  if (!Array.isArray(usuarios)) {
    return res.status(400).json({ message: 'Formato de datos incorrecto' });
  }

  try {
    for (const user of usuarios) {
      await SystemUsers.update(
        {
            rolpaciente: user.rolpaciente,
            rolmedico: user.rolmedico,
            roladministrativo: user.roladministrativo,
            rolsuperadmin: user.rolsuperadmin
        },
        { where: { idusuario: user.idusuario } }
      );
    }
    res.json({ message: 'Roles actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar roles:', error);
    res.status(500).json({ message: 'Error al actualizar roles' });
  }
});

module.exports = router;
