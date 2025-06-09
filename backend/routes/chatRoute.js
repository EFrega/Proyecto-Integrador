const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const ChatIndex = require('../models/chatindex')(sequelize, require('sequelize').DataTypes);
const ChatMsgs = require('../models/chatmsgs')(sequelize, require('sequelize').DataTypes);
const SystemUsers = require('../models/systemusers')(sequelize, require('sequelize').DataTypes);
const Contactos = require('../models/contactos')(sequelize, require('sequelize').DataTypes);

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

    const enrichedChats = await Promise.all(
      chats.map(async chat => {
        const idOtroUsuario = chat.idsystemuser1 === idusuario ? chat.idsystemuser2 : chat.idsystemuser1;

        const usuarioOtro = await SystemUsers.findOne({
          where: { idusuario: idOtroUsuario },
          attributes: ['idcontacto']
        });

        let contactoOtro = null;
        if (usuarioOtro?.idcontacto) {
          contactoOtro = await Contactos.findOne({
            where: { idcontacto: usuarioOtro.idcontacto },
            attributes: ['nombre', 'apellido']
          });
        }

        return {
          ...chat.toJSON(),
          nombreOtro: contactoOtro?.nombre || 'Desconocido',
          apellidoOtro: contactoOtro?.apellido || ''
        };
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
      chat = await ChatIndex.create({ idsystemuser1: id1, idsystemuser2: id2 });
    }

    // 👇 Enriquecer con nombre y apellido del otro usuario
    const idOtroUsuario = chat.idsystemuser1 === id1 ? chat.idsystemuser2 : chat.idsystemuser1;

    const SystemUsers = require('../models/systemusers')(sequelize, require('sequelize').DataTypes);
    const Contactos = require('../models/contactos')(sequelize, require('sequelize').DataTypes);
    const usuarioOtro = await SystemUsers.findOne({
      where: { idusuario: idOtroUsuario },
      attributes: ['idcontacto']
    });

    let contactoOtro = null;
    if (usuarioOtro?.idcontacto) {
      contactoOtro = await Contactos.findOne({
        where: { idcontacto: usuarioOtro.idcontacto },
        attributes: ['nombre', 'apellido']
      });
    }

    res.json({
      ...chat.toJSON(),
      nombreOtro: contactoOtro?.nombre,
      apellidoOtro: contactoOtro?.apellido
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
    console.error('🔥 Error al obtener mensajes:', error);
    res.status(500).json({ message: 'Error al obtener mensajes' });
  }
});

module.exports = router;