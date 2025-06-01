const request = require('supertest');
const { app } = require('../server/index'); // o solo `require('../server/index')` si exportás solo `app`

describe('POST /login', () => {
  it('debería fallar si el usuario no existe', async () => {
    const res = await request(app)
      .post('/login')
      .send({ usuario: 'test@test.com', contrasena: '123456' });
      //.send({ usuario: 'usuarioInvalido', contrasena: '1234' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/No existe el usuario/i);
  });

  // Este test requiere un usuario real en la DB para que funcione correctamente
  // it('debería autenticar usuario válido', async () => {
  //   const res = await request(app)
  //     .post('/login')
  //     .send({ usuario: 'test@test.com', contrasena: '123456' });

  //   expect(res.statusCode).toBe(200);
  //   expect(res.body).toHaveProperty('token');
  // });
});
