// socketHandler.js
module.exports = (io, ChatMsgs) => {
  io.on('connection', socket => {
    console.log('🟢 Cliente conectado:', socket.id);

    socket.on('enviar-mensaje', async (msg) => {
      try {
        const nuevo = await ChatMsgs.create({
          idchat: msg.idchat,
          idsystemuseremisor: msg.idsystemuseremisor,
          msgtexto: msg.msgtexto,
          msgtimesent: msg.msgtimesent || new Date(),
          msgstatus: 1
        });
        io.emit('nuevo-mensaje', nuevo);
      } catch (error) {
        console.error('Error al guardar mensaje:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 Cliente desconectado:', socket.id);
    });
  });
};
