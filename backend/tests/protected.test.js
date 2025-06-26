require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const {app} = require('../server/index');

jest.setTimeout(15000);

describe('Acceso a rutas protegidas con JWT', () => {
  let token;

  beforeAll(async () => {
    const login = await request(app).post('/login').send({
      usuario: 'moni@example.com',
      contrasena: 'password'
    });

    token = login.body.token;
    expect(token).toBeDefined(); // Verifica que se obtuvo token
  });

  test('Debería acceder con token válido', async () => {
    const res = await request(app)
      .get('/usuarios') // Podés cambiar a otra ruta protegida si preferís
      .set('Authorization', `Bearer ${token}`);

    console.log(res.body);
    expect(res.statusCode).toBe(200);
  });

  test('Debería rechazar acceso sin token', async () => {
    const res = await request(app).get('/usuarios');
    expect(res.statusCode).toBe(401); // o 403 según tu lógica
  });

  test('Debería rechazar acceso con token inválido', async () => {
    const res = await request(app)
      .get('/usuarios')
      .set('Authorization', 'Bearer token-falso');

    expect(res.statusCode).toBe(403); // o 403 según tu lógica
  });
});
