const request = require('supertest');
const { app } = require('../server/index');

describe('POST /register', () => {
  const nuevoUsuario = {
    usuario: `testuser_${Date.now()}`,
    contrasena: 'Test1234'
  };

  it('debería registrar un nuevo usuario', async () => {
    const res = await request(app)
      .post('/register')
      .send(nuevoUsuario);

    expect(res.statusCode).toBe(201); // O 200, según tu implementación
    expect(res.body.message || res.body.usuario).toBeDefined();
  });
});
