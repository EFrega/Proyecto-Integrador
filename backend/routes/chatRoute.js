const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const { ChatIndex, ChatMsgs, SystemUsers, Contactos } = require('../models');

router.get('/chats/:idusuario', async (req, res) => {
  const idusuario = parseInt(req.params.idusuario);

  try {
    const chats = await ChatIndex.findAll({
      where: {
        [sequelize.Sequelize.Op.or]: [
          { idsystemuser1: idusuario },
          { idsystemuser2: idusuario }
        ]
      }
    });

    console.log('🟢 Chats encontrados:', chats.length);

    const enrichedChats = await Promise.all(
      chats.map(async chat => {
        try {
          const idOtroUsuario = chat.idsystemuser1 === idusuario
            ? chat.idsystemuser2
            : chat.idsystemuser1;

          const usuarioOtro = await SystemUsers.findOne({
            where: { idcontacto: idOtroUsuario },
            include: [{
              model: Contactos,
              as: 'contacto',
              attributes: ['nombre', 'apellido']
            }]
          });

          console.log('🧪 usuarioOtro:', JSON.stringify(usuarioOtro, null, 2));

          const nombre = usuarioOtro?.contacto?.nombre || 'Desconocido';
          const apellido = usuarioOtro?.contacto?.apellido || '';

          return {
            ...chat.toJSON(),
            nombreOtro: nombre,
            apellidoOtro: apellido
          };

        } catch (innerErr) {
          console.error('❌ Error enriqueciendo un chat:', innerErr);
          return {
            ...chat.toJSON(),
            nombreOtro: 'ERROR',
            apellidoOtro: ''
          };
        }
      })
    );

    res.json(enrichedChats);

  } catch (error) {
    console.error('🔥 Error al obtener chats:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


// Crear nuevo chat si no existe
router.post('/chats', async (req, res) => {
  const { id1, id2 } = req.body;

  try {
    let chat = await ChatIndex.findOne({
      where: {
        [sequelize.Sequelize.Op.or]: [
          { idsystemuser1: id1, idsystemuser2: id2 },
          { idsystemuser1: id2, idsystemuser2: id1 }
        ]
      }
    });

    if (!chat) {
      chat = await ChatIndex.create({
        idsystemuser1: id1,
        idsystemuser2: id2
      });
    }

    const idOtroUsuario = chat.idsystemuser1 === id1 ? chat.idsystemuser2 : chat.idsystemuser1;

    const usuarioOtro = await SystemUsers.findOne({
      where: { idusuario: idOtroUsuario },
      include: [{
        model: Contactos,
        as: 'contacto',
        attributes: ['nombre', 'apellido']
      }]
    });

    console.log('🧪 usuarioOtro:', JSON.stringify(usuarioOtro, null, 2));
    const nombre = usuarioOtro?.contacto?.nombre || 'Desconocido';
    const apellido = usuarioOtro?.contacto?.apellido || '';

    res.json({
      ...chat.toJSON(),
      nombreOtro: nombre,
      apellidoOtro: apellido
    });

  } catch (error) {
    console.error('🔥 Error al crear chat:', error);
    res.status(500).json({ message: 'Error al crear chat' });
  }
});


    // Enviar mensaje
    router.post('/mensajes', async (req, res) => {
    const { idchat, idsystemuseremisor, msgtexto } = req.body;
    const mensaje = await ChatMsgs.create({ idchat, idsystemuseremisor, msgtexto });
    res.json(mensaje);
    });

    // Obtener mensajes por idchat
    router.get('/mensajes/:idchat', async (req, res) => {
    try {
        const mensajes = await ChatMsgs.findAll({
        where: { idchat: req.params.idchat },
        order: [['msgtimesent', 'ASC']]
        });
        res.json(mensajes);
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).json({ message: 'Error al obtener mensajes' });
    }
});

module.exports = router;