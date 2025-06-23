const express = require('express');
const router = express.Router();

const sequelize = require('../config/database');
const SystemUsersModel = require('../models/systemusers');
const ContactosModel = require('../models/contactos');

const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);
const Contactos = ContactosModel(sequelize, require('sequelize').DataTypes);

router.post('/', async (req, res) => {
  const {
    nombre, apellido, docum, tipodoc, fechanacim,
    telcontacto, telemergencia, correo, direccion,
    usuario, contrasena
  } = req.body;

  //  Validaciones manuales básicas
  if (!nombre || !apellido || !docum || !tipodoc || !fechanacim || !correo || !direccion || !contrasena) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  //  Validar formato de correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof correo !== 'string' || !emailRegex.test(correo)) {
    return res.status(400).json({ message: 'Formato de correo inválido' });
  }

  //  Validar longitud mínima de contraseña
  if (typeof contrasena !== 'string' || contrasena.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  // Validar que la fecha de nacimiento no sea futura
  const fechaNacimientoDate = new Date(fechanacim);
  const hoy = new Date();
  if (isNaN(fechaNacimientoDate.getTime()) || fechaNacimientoDate > hoy) {
    return res.status(400).json({ message: 'Fecha de nacimiento inválida' });
  }

  try {
    // Validar duplicados antes de la transacción
    const existeCorreo = await Contactos.findOne({ where: { correo } });
    if (existeCorreo) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    const existeDocum = await Contactos.findOne({ where: { docum } });
    if (existeDocum) {
      return res.status(409).json({ error: 'El documento ya está registrado' });
    }

    //  Iniciar transacción para alta segura
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
      console.error('Error en la transacción:', error);
      return res.status(500).json({ message: 'Error al registrar el usuario' });
    }

  } catch (error) {
    console.error('Error general en /register:', error);
    return res.status(500).json({ message: 'Error inesperado al registrar' });
  }
});

module.exports = router;
