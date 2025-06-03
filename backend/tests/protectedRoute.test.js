const request = require('supertest');
const { app } = require('../server/index');
const sequelize = require('../config/database');
const Usuario = require('../models/systemusers');
const jwt = require('jsonwebtoken');

const usuarioModelo = Usuario(sequelize, require('sequelize').DataTypes);

describe('GET /usuarios/:id (ruta protegida)', () => {
  let usuarioTest;
  let tokenValido;

  beforeAll(async () => {
    // Crear usuario de prueba
    usuarioTest = await usuarioModelo.create({
      usuario: 'protectedtest@test.com',
      contrasena: 'Test1234',
      rolpaciente: true,
      rolmedico: false,
      roladministrativo: false,
      rolsuperadmin: false
    });

    // Generar token válido
    const jwtSecret = process.env.JWT_SECRET || 'secreto';
    tokenValido = jwt.sign(
      { id: usuarioTest.idusuario, usuario: usuarioTest.usuario },
      jwtSecret,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Limpiar usuario de prueba
    if (usuarioTest) {
      await usuarioModelo.destroy({ where: { idusuario: usuarioTest.idusuario } });
    }
  });

  it('debería rechazar sin token', async () => {
    const res = await request(app).get('/usuarios/1');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Token no proporcionado/i);
  });

  it('debería rechazar con token inválido', async () => {
    const res = await request(app)
      .get('/usuarios/1')
      .set('Authorization', 'Bearer tokenInvalido');

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/Token inválido/i);
  });

  it('debería devolver usuario con token válido', async () => {
    const res = await request(app)
      .get(`/usuarios/${usuarioTest.idusuario}`)
      .set('Authorization', `Bearer ${tokenValido}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.usuario).toBe('protectedtest@test.com');
  });

  it('debería fallar si el usuario no existe', async () => {
    const res = await request(app)
      .get('/usuarios/99999') // ID que no existe
      .set('Authorization', `Bearer ${tokenValido}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Usuario no encontrado/i);
  });
});