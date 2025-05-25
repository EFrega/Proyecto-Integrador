const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const SystemUsersModel = require('../models/systemusers');
const ProfesionalesModel = require('../models/profesionales');

const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);
const Profesionales = ProfesionalesModel(sequelize, require('sequelize').DataTypes);

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
            activo: true
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

module.exports = router;