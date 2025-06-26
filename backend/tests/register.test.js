require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const { app } = require('../server/index');
const sequelize = require('../config/database');

jest.setTimeout(15000);

describe('Registro de usuario', () => {
  beforeAll(async () => {
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('debería registrar un usuario nuevo exitosamente', async () => {
    const timestamp = Date.now();
    const usuario = {
      usuario: `usuario${timestamp}@mail.com`,
      contrasena: '12345678',
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: `correo${timestamp}@mail.com`,
      docum: `${99999 + Math.floor(Math.random() * 10000)}`,
      tipodoc: 'DNI',
      direccion: 'Av Siempre Viva 742',
      fechanacim: '1990-01-01'
    };


    const res = await request(app).post('/register').send(usuario);

    console.log(res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/registrado/i);
  });

    test('debería rechazar el registro con datos incompletos', async () => {
    const res = await request(app).post('/register').send({
      usuario: '',
      correo: '',
      contrasena: '',
    });

    console.log(res.body); // Para depuración si falla

    expect(res.statusCode).toBe(400);
    expect(res.body.message || res.body.error).toMatch(/faltan|incompletos|obligatorios/i);
  });

  test('debería fallar con usuario duplicado', async () => {
    const res = await request(app).post('/register').send({
      usuario: 'moni@example.com', // mismo que en la base
      contrasena: 'OtraPass123!',
      nombre: 'Otra Monica',
      apellido: 'Distinta',
      docum: `${Math.floor(Math.random() * 100000000)}`, // documento único
      tipodoc: 'DNI',
      fechanacim: '1992-02-02',
      telcontacto: '1123456789',
      telemergencia: '1198765432',
      correo: 'moni@example.com',
      direccion: 'Otra dirección 789'
    });

    console.log(res.body);
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

});
