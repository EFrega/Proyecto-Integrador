const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const sequelize = require('../config/database');

// Cargar e instanciar modelos (una sola vez)
const ContactosModel = require('../models/contactos');
const SystemUsersModel = require('../models/systemusers');
const ProfesionalesModel = require('../models/profesionales');
const ProfServiciosModel = require('../models/profservicios');
const ServiciosModel = require('../models/servicios');

const Contactos = ContactosModel(sequelize, require('sequelize').DataTypes);
const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);
const Profesionales = ProfesionalesModel(sequelize, require('sequelize').DataTypes);
const ProfServicios = ProfServiciosModel(sequelize, require('sequelize').DataTypes);
const Servicios = ServiciosModel(sequelize, require('sequelize').DataTypes);

// Definir asociaciones
SystemUsers.belongsTo(Contactos, { foreignKey: 'idcontacto', targetKey: 'idcontacto' });
Contactos.hasOne(SystemUsers, { foreignKey: 'idcontacto', sourceKey: 'idcontacto' });

Contactos.hasOne(Profesionales, { foreignKey: 'idcontacto', sourceKey: 'idcontacto', as: 'profesional' });
Profesionales.belongsTo(Contactos, { foreignKey: 'idcontacto', targetKey: 'idcontacto', as: 'contacto' });

Profesionales.hasMany(ProfServicios, { foreignKey: 'idprofesional', sourceKey: 'idprofesional', as: 'profServicios' });
ProfServicios.belongsTo(Profesionales, { foreignKey: 'idprofesional', targetKey: 'idprofesional', as: 'profesional' });

ProfServicios.belongsTo(Servicios, { foreignKey: 'idservicio', targetKey: 'idservicio', as: 'servicio' });
Servicios.hasMany(ProfServicios, { foreignKey: 'idservicio', sourceKey: 'idservicio', as: 'profServicios' });

// Obtener todos los contactos
router.get('/', async (req, res) => {
  const { excluir, nombre, apellido, docum, rolusuario } = req.query;

  try {
    const whereContactos = {};
    if (excluir) {
      whereContactos.idcontacto = { [Op.ne]: Number(excluir) };
    }
    if (nombre) {
      whereContactos.nombre = { [Op.like]: `%${nombre}%` };
    }
    if (apellido) {
      whereContactos.apellido = { [Op.like]: `%${apellido}%` };
    }
    if (docum && rolusuario === 'rolmedico') {
      whereContactos.docum = { [Op.like]: `%${docum}%` };
    }

    // Si es administrativo o superadmin, NO mostrar nada
    if (rolusuario === 'roladministrativo' || rolusuario === 'rolsuperadmin') {
      return res.json([]); // devolver vacío
    }

    const include = [
      {
        model: SystemUsers,
        attributes: ['rolpaciente', 'rolmedico'],
        where: {}
      }
    ];

    // Si el usuario es médico → mostrar pacientes
    if (rolusuario === 'rolmedico') {
      include[0].where.rolpaciente = true;
    }

    // Si el usuario es paciente → mostrar médicos CON servicio activo
    if (rolusuario === 'rolpaciente') {
      include[0].where.rolmedico = true;

      include.push({
        model: Profesionales,
        as: 'profesional',
        required: true,
        where: { activo: true },
        include: [
          {
            model: ProfServicios,
            as: 'profServicios',
            required: true,
            where: { activo: true },
            include: [
              {
                model: Servicios,
                as: 'servicio',
                required: true,
                where: { activo: true }
              }
            ]
          }
        ]
      });
    }

    const contactosFiltrados = await Contactos.findAll({
      where: whereContactos,
      include
    });

    // Si el usuario es paciente → transformar el resultado para que tenga nombre_servicio
    if (rolusuario === 'rolpaciente') {
      const contactosConServicio = contactosFiltrados.map(contacto => {
        const profesional = contacto.profesional;
        const profServicio = profesional?.profServicios?.[0];
        const servicio = profServicio?.servicio;

        // DEBUG
        console.log({
          contacto: contacto.nombre,
          servicioNombre: servicio?.nombre,
          servicioObjeto: servicio
        });

        return {
          idcontacto: contacto.idcontacto,
          nombre: contacto.nombre,
          apellido: contacto.apellido,
          nombre_servicio: servicio ? servicio.nombre : ''
        };
      });

      return res.json(contactosConServicio);
    }

    // Si es médico → devolver normal (con SystemUser)
    res.json(contactosFiltrados);
  } catch (error) {
    console.error('🔥 Error al obtener contactos:', error);
    res.status(500).json({ message: 'Error al obtener contactos' });
  }
});

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
