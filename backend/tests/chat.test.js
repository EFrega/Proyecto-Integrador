const { io } = require('socket.io-client');
const { app, server } = require('../server/index');
const sequelize = require('../config/database');

jest.setTimeout(15000);

describe('WebSocket Chat', () => {
  let socket;

  beforeAll((done) => {
    server.listen(() => {
      const port = server.address().port;
      socket = io(`http://localhost:${port}`, {
        transports: ['websocket'],
      });
      socket.on('connect', done);
    });
  });

  afterAll((done) => {
    if (socket.connected) {
      socket.disconnect();
    }
    server.close(() => {
      sequelize.close().then(done);
    });
  });

  test('debería enviar y recibir un mensaje por WebSocket', (done) => {
    const mensajeDePrueba = {
      idchat: 26,                  // chat ya existente
      idsystemuseremisor: 65,      // usuario emisor (doctor)
      msgtexto: 'Mensaje de test desde Jest',
      msgtiemsent: new Date().toISOString()
    };

    socket.emit('enviar-mensaje', mensajeDePrueba);

    socket.on('nuevo-mensaje', (recibido) => {
      try {
        expect(recibido).toHaveProperty('idchat', 26);
        expect(recibido).toHaveProperty('msgtexto', mensajeDePrueba.msgtexto);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
