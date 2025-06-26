// backend/tests/login.test.js
require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const { app } = require('../server/index'); // Extraemos solo `app`, no todo el objeto

jest.setTimeout(15000);

describe('Login de usuario', () => {
    test('debería autenticar exitosamente con credenciales válidas', async () => {
        const res = await request(app)
        .post('/login')
        .send({
            usuario: 'moni@example.com',
            contrasena: 'password' // asegurate que sea la contraseña correcta
        });
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('debería fallar con contraseña incorrecta', async () => {
        const res = await request(app)
        .post('/login')
        .send({
            usuario: 'moni@example.com',
            contrasena: 'contramal'
        });
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'Credenciales incorrectas');
    });

    test('debería fallar con usuario inexistente', async () => {
        const res = await request(app)
        .post('/login')
        .send({
            usuario: 'inexistente@example.com',
            contrasena: 'algo'
        });
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'No existe el usuario');
    });
});
