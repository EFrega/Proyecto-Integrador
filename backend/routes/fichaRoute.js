// fichaRoute.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const FichaMedicaModel = require('../models/fichamedica');
const SystemUsersModel = require('../models/systemusers');

const FichaMedica = FichaMedicaModel(sequelize, require('sequelize').DataTypes);
const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);

// Obtener ficha médica por ID de contacto
router.get('/:idcontacto', async (req, res) => {
    try {
        console.log('Buscando ficha para contacto ID:', req.params.idcontacto); // DEBUG
        const ficha = await FichaMedica.findOne({ where: { idcontacto: req.params.idcontacto } });
        if (!ficha) return res.status(404).json({});
        res.json(ficha);
    } catch (err) {
        console.error('Error al buscar ficha médica:', err);
        res.status(500).json({ message: 'Error al buscar ficha médica' });
    }
});

// Guardar o actualizar ficha médica
router.post('/', async (req, res) => {
    const { idusuario, idcontacto, gruposang, cobertura, histenfermflia, observficha } = req.body;

    try {
        const user = await SystemUsers.findByPk(idusuario);
        if (!user) return res.status(403).json({ message: 'Usuario no autorizado' });

        const updateData = {};

        // Reglas de autorización
        if (user.rolsuperadmin || user.roladministrativo || user.rolmedico) {
            updateData.gruposang = gruposang;
            updateData.cobertura = cobertura;
        }

        if (user.rolmedico) {
            updateData.histenfermflia = histenfermflia;
            updateData.observficha = observficha;
        }

        if (user.rolpaciente && user.idcontacto === idcontacto) {
            updateData.cobertura = cobertura;
        }

        // Si no se puede guardar ningún campo
        if (Object.keys(updateData).length === 0) {
            return res.status(403).json({ message: 'No tiene permisos para modificar ningún campo', camposGuardados: [] });
        }

        const existingFicha = await FichaMedica.findOne({ where: { idcontacto } });

        if (existingFicha) {
            await existingFicha.update(updateData);
        } else {
            await FichaMedica.create({ idcontacto, ...updateData });
        }

        res.json({
            message: 'Ficha médica guardada',
            camposGuardados: Object.keys(updateData)
        });
    } catch (error) {
        console.error('Error al guardar ficha médica:', error);
        res.status(500).json({ message: 'Error al guardar ficha médica' });
    }
});

module.exports = router;
