const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const TurnosModel = require('../models/turnos');
const AgendaProRegularModel = require('../models/agendaproregular');
const AgendaProfExcepModel = require('../models/agendaprofexcep');
const AgendaFeriadosModel = require('../models/agendaferiados');
const ServiciosModel = require('../models/servicios');
const ProfesionalesModel = require('../models/profesionales');
const ContactosModel = require('../models/contactos');

const Turnos = TurnosModel(sequelize, require('sequelize').DataTypes);
const AgendaProRegular = AgendaProRegularModel(sequelize, require('sequelize').DataTypes);
const AgendaProfExcep = AgendaProfExcepModel(sequelize, require('sequelize').DataTypes);
const AgendaFeriados = AgendaFeriadosModel(sequelize, require('sequelize').DataTypes);
const Servicios = ServiciosModel(sequelize, require('sequelize').DataTypes);
const Profesionales = ProfesionalesModel(sequelize, require('sequelize').DataTypes);
const Contactos = ContactosModel(sequelize, require('sequelize').DataTypes);

Profesionales.belongsTo(Contactos, { foreignKey: 'idcontacto', as: 'contacto' });
Turnos.belongsTo(Profesionales, { foreignKey: 'idprofesional', as: 'Profesional' });
Turnos.belongsTo(Contactos, { foreignKey: 'idcontacto', as: 'Contacto' });
Turnos.belongsTo(Servicios, { foreignKey: 'idservicio', as: 'Servicio' });

const { Op } = require('sequelize');
const moment = require('moment');

// GET turnos disponibles
router.get('/disponibles/:idprofesional/:idservicio', async (req, res) => {
  const { idprofesional, idservicio } = req.params;

  try {
    const servicio = await Servicios.findByPk(idservicio);
    if (!servicio) return res.status(404).json({ message: 'Servicio no encontrado' });

    const agenda = await AgendaProRegular.findOne({
      where: { idprofesional, idservicio }
    });
    if (!agenda) return res.status(404).json({ message: 'Agenda no encontrada' });

    const excepciones = await AgendaProfExcep.findAll({
      where: {
        idprofesional,
        dia_inicio: { [Op.lte]: moment().add(45, 'days').endOf('day').toDate() },
        dia_fin: { [Op.gte]: moment().startOf('day').toDate() }
      }
    });

    const feriados = await AgendaFeriados.findAll({
      where: {
        dia: { [Op.between]: [moment().startOf('day').toDate(), moment().add(45, 'days').endOf('day').toDate()] }
      }
    });

    const turnosReservados = await Turnos.findAll({
      where: {
        idprofesional,
        idservicio,
        reservado: true,
        dia: { [Op.between]: [moment().startOf('day').toDate(), moment().add(45, 'days').endOf('day').toDate()] }
      }
    });

    // ----------------------
    // Construcción de disponibilidad
    // ----------------------

    const diasSemana = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];

    const disponibilidad = [];

    for (let i = 0; i <= 45; i++) {
      const diaActual = moment().add(i, 'days');
      const nombreDia = diasSemana[diaActual.day() === 0 ? 6 : diaActual.day() - 1]; // mapear 0 (domingo) a 'dom'

      // Verificar si el profesional atiende ese día
      if (!agenda[nombreDia]) continue;

      // Verificar feriado
      const esFeriado = feriados.find(f => moment(f.dia).isSame(diaActual, 'day'));
      if (esFeriado) continue;

      // Verificar excepción
      const esExcepcion = excepciones.find(e =>
        moment(diaActual).isBetween(moment(e.dia_inicio).startOf('day'), moment(e.dia_fin).endOf('day'), null, '[]')
      );
      if (esExcepcion) continue;

      // Construir turnos disponibles del día
      const horaInicio = moment(agenda[`hora_init_${nombreDia}`], 'HH:mm:ss');
      const horaFin = moment(agenda[`hora_fin_${nombreDia}`], 'HH:mm:ss');

      const turnosDelDia = [];
      let horaActual = horaInicio.clone();

    while (horaActual.isBefore(horaFin)) {
    const horaStr = horaActual.format('HH:mm:ss');

    const yaReservado = turnosReservados.find(t =>
        moment(t.dia).startOf('day').isSame(diaActual.clone().startOf('day'), 'day') &&
        moment(t.hora, ['HH:mm:ss', 'HH:mm']).format('HH:mm:ss') === horaStr
    );

    // Si es hoy, no mostrar turnos en horas pasadas
    if (diaActual.isSame(moment(), 'day')) {
        const horaActualStr = horaActual.format('HH:mm');
        const horaNowStr = moment().format('HH:mm');

        if (horaActualStr < horaNowStr) {
        horaActual.add(servicio.duracionturno, 'minutes');
        continue;
        }
    }

    if (!yaReservado) {
        turnosDelDia.push(horaStr);
    }

    horaActual.add(servicio.duracionturno, 'minutes');
    }



      if (turnosDelDia.length > 0) {
        disponibilidad.push({
          dia: diaActual.format('YYYY-MM-DD'),
          horarios: turnosDelDia
        });
      }
    }

    res.json(disponibilidad);

  } catch (err) {
    console.error('Error al obtener turnos disponibles:', err);
    res.status(500).json({ message: 'Error al obtener turnos disponibles' });
  }
});

// POST reservar turno
router.post('/reservar', async (req, res) => {
  const { idcontacto, idprofesional, idservicio, dia, hora } = req.body;

  try {
    // Verificar que el turno no esté ya reservado
    const turnoExistente = await Turnos.findOne({
      where: {
        idprofesional,
        idservicio,
        dia,
        hora,
        reservado: true
      }
    });

    if (turnoExistente) {
      return res.status(400).json({ message: 'El turno ya fue reservado por otro paciente' });
    }

    await Turnos.create({
      idcontacto,
      idprofesional,
      idservicio,
      dia,
      hora,
      reservado: true,
      confirmado: false,
      acreditado: false,
      atendido: false,
      prioridad: 0,
      tipo: 0,
      observaciones: '',
      updsystemuser: null,
      updatetime: new Date()
    });

    res.json({ message: 'Turno reservado correctamente' });

  } catch (err) {
    console.error('Error al reservar turno:', err);
    res.status(500).json({ message: 'Error al reservar turno' });
  }
});

// GET turnos reservados para un contacto (paciente) o para profesional
router.get('/mis-turnos/:idcontacto', async (req, res) => {
  const { idcontacto } = req.params;
    try {
      const turnos = await Turnos.findAll({
      where: {
        idcontacto,
        [Op.or]: [
          { reservado: true },
          { atendido: true }
        ]
      },
    attributes: ['idturno', 'dia', 'hora', 'atendido',  'acreditado', 'observaciones', 'idprofesional', 'idservicio'],
    include: [
      {
        model: Profesionales,
        as: 'Profesional',
        include: [
          {
            model: Contactos,
            as: 'contacto',
            attributes: ['nombre', 'apellido', 'fechanacim']
          }
        ]
      },
      {
        model: Servicios,
        as: 'Servicio',
        attributes: ['idservicio', 'nombre']
      }
    ],
    order: [['dia', 'ASC'], ['hora', 'ASC']]
  });


    res.json(turnos);
  } catch (err) {
    console.error('Error al obtener turnos reservados:', err);
    res.status(500).json({ message: 'Error al obtener turnos reservados' });
  }
});


router.get('/mis-turnos-profesional/:idprofesional', async (req, res) => {
  const { idprofesional } = req.params;

  try {
    const turnos = await Turnos.findAll({
      where: {
        idprofesional,
        reservado: true,
        acreditado: true
      },
      include: [
        {
          model: Contactos,
          as: 'Contacto',
          attributes: ['nombre', 'apellido']
        },
        {
          model: Servicios,
          as: 'Servicio',
          attributes: ['nombre']
        }
      ],
      order: [['dia', 'ASC'], ['hora', 'ASC']]
    });

  const turnosAdaptados = turnos.map(t => ({
    idturno: t.idturno,
    nombre: t.Contacto?.nombre || '',
    apellido: t.Contacto?.apellido || '',
    nombreservicio: t.Servicio?.nombre || '',
    dia: t.dia,
    hora: t.hora,
    atendido: t.atendido,
    acreditado: t.acreditado  
  }));

    res.json(turnosAdaptados);
  } catch (err) {
    console.error('Error al obtener turnos del profesional:', err);
    res.status(500).json({ message: 'Error al obtener turnos del profesional' });
  }
});



// DELETE cancelar turno
router.delete('/cancelar/:idturno', async (req, res) => {
  const { idturno } = req.params;

  try {
    const turno = await Turnos.findByPk(idturno);
    if (!turno) return res.status(404).json({ message: 'Turno no encontrado' });

    // Marcar como NO reservado
    await turno.update({
      reservado: false,
      confirmado: false,
      acreditado: false,
      atendido: false
    });

    res.json({ message: 'Turno cancelado correctamente' });
  } catch (err) {
    console.error('Error al cancelar turno:', err);
    res.status(500).json({ message: 'Error al cancelar turno' });
  }
});

// GET profesionales por servicio
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

router.put('/acreditar/:idturno', async (req, res) => {
  const { idturno } = req.params;

  try {
    const turno = await Turnos.findByPk(idturno);
    if (!turno) return res.status(404).json({ message: 'Turno no encontrado' });

    turno.acreditado = true;
    await turno.save();

    res.json({ message: 'Turno acreditado correctamente' });
  } catch (error) {
    console.error('Error al acreditar turno:', error);
    res.status(500).json({ message: 'Error al acreditar turno' });
  }
});

// Obtener un turno por ID
router.get('/:idturno', async (req, res) => {
  try {
    const { idturno } = req.params;
    const turno = await Turnos.findOne({
      where: { idturno },
      include: [
        { model: Contactos, as: 'Contacto', attributes: ['nombre', 'apellido', 'fechanacim'] },
        { model: Servicios, as: 'Servicio', attributes: ['nombre'] },
        { model: Profesionales, as: 'Profesional', attributes: ['matricula'] }
      ]
    });

    if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });

    const contacto = await Contactos.findByPk(turno.idcontacto);
    res.json({
      ...turno.toJSON(),
      nombre: contacto?.nombre || '',
      apellido: contacto?.apellido || '',
      fechanacim: contacto?.fechanacim || null
    });
  } catch (err) {
    console.error('Error al obtener el turno:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /turnos/:idturno - Marcar como atendido y guardar observaciones
router.put('/:idturno', async (req, res) => {
  const { idturno } = req.params;
  const { observaciones, atendido } = req.body;

  try {
    const turno = await Turnos.findByPk(idturno);
    if (!turno) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    turno.atendido = !!atendido; // por las dudas, lo forzamos a booleano
    turno.observaciones = observaciones || '';

    await turno.save();

    res.json({ message: 'Turno actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el turno:', error);
    res.status(500).json({ message: 'Error al actualizar el turno' });
  }
});

module.exports = router;
