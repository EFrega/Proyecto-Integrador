const request = require('supertest');
const { app } = require('../server/index');
const sequelize = require('../config/database');
const Usuario = require('../models/systemusers');

const usuarioModelo = Usuario(sequelize, require('sequelize').DataTypes);

describe('POST /login', () => {
  let usuarioTest;

  beforeAll(async () => {
    // Crear usuario de prueba
    usuarioTest = await usuarioModelo.create({
      usuario: 'testuser@test.com',
      contrasena: 'Test1234', // Se cifrará automáticamente por el hook
      rolpaciente: true,
      rolmedico: false,
      roladministrativo: false,
      rolsuperadmin: false
    });
  });

  afterAll(async () => {
    // Limpiar usuario de prueba
    if (usuarioTest) {
      await usuarioModelo.destroy({ where: { idusuario: usuarioTest.idusuario } });
    }
  });

  it('debería fallar si el usuario no existe', async () => {
    const res = await request(app)
      .post('/login')
      .send({ usuario: 'usuarioInvalido', contrasena: '1234' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/No existe el usuario/i);
  });

  it('debería fallar con contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/login')
      .send({ usuario: 'testuser@test.com', contrasena: 'contraseñaIncorrecta' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Credenciales incorrectas/i);
  });

  it('debería autenticar usuario válido', async () => {
    const res = await request(app)
      .post('/login')
      .send({ usuario: 'testuser@test.com', contrasena: 'Test1234' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('usuario', 'testuser@test.com');
    expect(res.body).toHaveProperty('roles');
    expect(res.body.roles.rolpaciente).toBe(true);
  });

  it('debería fallar con datos incompletos', async () => {
    const res = await request(app)
      .post('/login')
      .send({ usuario: 'testuser@test.com' }); // Falta contraseña

    expect(res.statusCode).toBe(401);
  });
});