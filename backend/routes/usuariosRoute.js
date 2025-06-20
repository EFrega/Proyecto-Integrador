const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const SystemUsersModel = require('../models/systemusers');
const ContactosModel = require('../models/contactos');
const Usuario = require('../models/systemusers');

const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);
const Contactos = ContactosModel(sequelize, require('sequelize').DataTypes);
const usuarioModelo = Usuario(sequelize, require('sequelize').DataTypes);

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

// Ruta protegida
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await usuarioModelo.findOne({ where: { idUsuario: id } });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.json(usuario);
    } catch (err) {
        return res.status(500).json({ error: 'Error en el servidor', detalle: err.message });
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

router.put('/resetear-contrasena/:idusuario', async (req, res) => {
  const { idusuario } = req.params;
  const { nuevaContrasena } = req.body;

  try {
    const usuario = await SystemUsers.findByPk(idusuario);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    usuario.contrasena = nuevaContrasena;
    await usuario.save();

    res.json({ message: 'Contraseña actualizada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar contraseña' });
  }
});


module.exports = router;
