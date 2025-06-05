const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const ChatIndex = require('../models/chatindex')(sequelize, require('sequelize').DataTypes);
const ChatMsgs = require('../models/chatmsgs')(sequelize, require('sequelize').DataTypes);

// Obtener chats por id de contacto
router.get('/chats/:idcontacto', async (req, res) => {
  const id = parseInt(req.params.idcontacto);
  const chats = await ChatIndex.findAll({
    where: {
      [sequelize.Sequelize.Op.or]: [
        { idsystemuser1: id },
        { idsystemuser2: id }
      ]
    }
  });
  res.json(chats);
});

// Crear nuevo chat si no existe
router.post('/chats', async (req, res) => {
  const { id1, id2 } = req.body;
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
  res.json(chat);
});

// Obtener mensajes por idchat
router.get('/mensajes/:idchat', async (req, res) => {
  const mensajes = await ChatMsgs.findAll({
    where: { idchat: req.params.idchat },
    order: [['msgtimesent', 'ASC']]
  });
  res.json(mensajes);
});

// Enviar mensaje
router.post('/mensajes', async (req, res) => {
  const { idchat, idsystemuseremisor, msgtexto } = req.body;
  const mensaje = await ChatMsgs.create({ idchat, idsystemuseremisor, msgtexto });
  res.json(mensaje);
});

module.exports = router;