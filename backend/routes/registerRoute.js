// Importamos Express y creamos un router
const express = require('express');
const router = express.Router();

// Importamos la conexión a la base de datos
const sequelize = require('../config/database');

// Importamos los modelos Sequelize de SystemUsers y Contactos
const SystemUsersModel = require('../models/systemusers');
const ContactosModel = require('../models/contactos');

// Instanciamos los modelos pasando sequelize y DataTypes
const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);
const Contactos = ContactosModel(sequelize, require('sequelize').DataTypes);

// Ruta POST para registrar un nuevo usuario
router.post('/', async (req, res) => {
  const {
    nombre, apellido, docum, tipodoc, fechanacim, telcontacto, telemergencia,
    correo, direccion, usuario, contrasena
  } = req.body;

  // Validaciones manuales
  if (!nombre || !apellido || !docum || !tipodoc || !fechanacim || !correo || !direccion || !contrasena) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  // Validar formato correo manualmente para evitar 500
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({ message: 'Correo inválido' });
  }

  // Validar longitud mínima contraseña manualmente para evitar 500
  if (contrasena.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  // Validar fecha no futura
  const fechaNacimientoDate = new Date(fechanacim);
  const hoy = new Date();
  if (isNaN(fechaNacimientoDate.getTime()) || fechaNacimientoDate > hoy) {
    return res.status(400).json({ message: 'Fecha de nacimiento inválida' });
  }

  try {
    // Validar duplicados antes de transacción para mejores errores
    const existeCorreo = await Contactos.findOne({ where: { correo } });
    if (existeCorreo) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }
    const existeDocum = await Contactos.findOne({ where: { docum } });
    if (existeDocum) {
      return res.status(409).json({ error: 'El documento ya está registrado' });
    }

    const t = await sequelize.transaction();

    try {
      const nuevoContacto = await Contactos.create({
        nombre,
        apellido,
        docum,
        tipodoc,
        fechanacim,
        telcontacto,
        telemergencia,
        correo,
        direccion
      }, { transaction: t });

      await SystemUsers.create({
        idcontacto: nuevoContacto.idcontacto,
        usuario: correo,
        contrasena,
        rolpaciente: 1,
        rolmedico: 0,
        roladministrativo: 0,
        rolsuperadmin: 0
      }, { transaction: t });

      await t.commit();
      return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      await t.rollback();
      console.error('Error al crear en transacción:', error);
      return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
  } catch (error) {
    console.error('Error general:', error);
    return res.status(500).json({ message: 'Error inesperado al registrar' });
  }
});



module.exports = router;
