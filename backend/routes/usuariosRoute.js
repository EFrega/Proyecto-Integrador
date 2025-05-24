const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const SystemUsersModel = require('../models/systemusers');
const ContactosModel = require('../models/contactos');

const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);
const Contactos = ContactosModel(sequelize, require('sequelize').DataTypes);

// Asociación
SystemUsers.belongsTo(Contactos, {
  foreignKey: 'idcontacto',
  as: 'contacto'
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await SystemUsers.findAll({
      attributes: [
        'idusuario',
        'usuario',
        'rolpaciente',
        'rolmedico',
        'roladministrativo',
        'rolsuperadmin'
      ],
      include: [
        {
          model: Contactos,
          as: 'contacto',
          attributes: ['nombre', 'apellido', 'docum']
        }
      ]
    });

    const usuariosFormateados = usuarios.map((u) => ({
      idusuario: u.idusuario,
      usuario: u.usuario,
      rolpaciente: u.rolpaciente,
      rolmedico: u.rolmedico,
      roladministrativo: u.roladministrativo,
      rolsuperadmin: u.rolsuperadmin,
      nombre: u.contacto?.nombre || '',
      apellido: u.contacto?.apellido || '',
      docum: u.contacto?.docum || ''
    }));

    res.json(usuariosFormateados);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Actualizar roles
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
        {
          where: { idusuario: user.idusuario }
        }
      );
    }

    res.json({ message: 'Roles actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar roles:', error);
    res.status(500).json({ message: 'Error al actualizar roles' });
  }
});

module.exports = router;
