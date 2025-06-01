const request = require('supertest');
const { app } = require('../server/index');

describe('GET /usuarios/:id (ruta protegida)', () => {
  it('debería rechazar sin token', async () => {
    const res = await request(app).get('/usuarios/1');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Token no proporcionado/i);
  });

  // it('debería devolver usuario con token válido', async () => {
  //   // 1. Loguearse para obtener token
  //   const loginRes = await request(app)
  //     .post('/login')
  //     .send({ usuario: 'usuarioValido', contrasena: 'claveValida' });

  //   const token = loginRes.body.token;
  //   const idUsuario = loginRes.body.id || 1;

  //   // 2. Acceder a la ruta protegida
  //   const res = await request(app)
  //     .get(`/usuarios/${idUsuario}`)
  //     .set('Authorization', `Bearer ${token}`);

  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.usuario).toBe('usuarioValido');
  // });
});
