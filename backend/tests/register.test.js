const request = require('supertest');
const { app, server } = require('../server/index');
const sequelize = require('../config/database');

function generateTestData(prefix = 'test') {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return {
    correo: `${prefix}_${timestamp}_${random}@test.com`,
    usuario: `${prefix}_user_${timestamp}_${random}`,
    nombre: `TestUser${timestamp}`,
    apellido: `TestApellido${timestamp}`,
    docum: `${(timestamp + random).toString().slice(0, 8)}`,
    contrasena: 'Password123!',
    fechanacim: '1990-01-01',
    tipodoc: 'DNI',
    telcontacto: '123456789',
    telemergencia: '987654321',
    direccion: 'Calle Falsa 123'
  };
}

jest.setTimeout(60000);

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await sequelize.authenticate();
  await sequelize.sync({ force: false });
});

afterAll(async () => {
  await new Promise((resolve, reject) => {
    server.close(err => (err ? reject(err) : resolve()));
  });
  await sequelize.close();
});

describe('POST /register', () => {
  it('debería registrar un nuevo usuario correctamente', async () => {
    const testUser = generateTestData('register_ok');

    const res = await request(app)
      .post('/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Usuario registrado exitosamente');
  });

  it('debería fallar con datos incompletos', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        usuario: '',
        correo: '',
        contrasena: '',
      });
    expect(res.statusCode).toBe(400);
  });

  it('debería fallar con correo duplicado', async () => {
    const testUser = generateTestData('dup_correo');

    await request(app).post('/register').send(testUser);

    const res = await request(app).post('/register').send({
      ...generateTestData('dup_correo2'),
      correo: testUser.correo,
      docum: `${Math.floor(Math.random() * 100000000)}` // doc distinto
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('debería fallar con docum duplicado', async () => {
    const testUser = generateTestData('dup_docum');

    await request(app).post('/register').send(testUser);

    const res = await request(app).post('/register').send({
      ...generateTestData('dup_docum2'),
      docum: testUser.docum,
      correo: `otro${Date.now()}@test.com`
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('debería validar formato de correo inválido', async () => {
    const user = generateTestData('bad_email');
    user.correo = 'emailinvalido';

    const res = await request(app).post('/register').send(user);
    expect(res.statusCode).toBe(400);
  });

  it('debería validar longitud mínima de contraseña', async () => {
    const user = generateTestData('bad_pass');
    user.contrasena = '123';

    const res = await request(app).post('/register').send(user);
    expect(res.statusCode).toBe(400);
  });

  it('debería manejar fechas de nacimiento inválidas', async () => {
    const user = generateTestData('bad_date');
    user.fechanacim = '3000-01-01';

    const res = await request(app).post('/register').send(user);
    expect(res.statusCode).toBe(400);
  });
});
