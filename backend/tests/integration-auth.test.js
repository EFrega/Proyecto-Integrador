const request = require('supertest');
const { app } = require('../server/index');
const sequelize = require('../config/database');

// Importar modelos
const SystemUsersModel = require('../models/systemusers');
const ContactosModel = require('../models/contactos');

const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);
const Contactos = ContactosModel(sequelize, require('sequelize').DataTypes);

describe('Flujo Completo de Autenticación', () => {
  const datosUsuario = {
    nombre: 'María',
    apellido: 'González',
    docum: '98765432',
    tipodoc: 'DNI',
    fechanacim: '1985-03-20',
    telcontacto: '555123456',
    telemergencia: '555654321',
    correo: `integration_${Date.now()}@test.com`,
    direccion: 'Av. Principal 456',
    usuario: 'testuser',
    contrasena: 'IntegrationTest123'
  };

  let usuarioCreado = false;

  afterAll(async () => {
    // Limpiar datos después de todos los tests
    if (usuarioCreado) {
      const t = await sequelize.transaction();
      try {
        await SystemUsers.destroy({ 
          where: { usuario: datosUsuario.correo },
          transaction: t 
        });
        await Contactos.destroy({ 
          where: { correo: datosUsuario.correo },
          transaction: t 
        });
        await t.commit();
      } catch (error) {
        await t.rollback();
      }
    }
  });

  it('debería completar el flujo: registro → login → acceso protegido', async () => {
    // 1. REGISTRO
    console.log('Paso 1: Registrando usuario...');
    const registerRes = await request(app)
      .post('/register')
      .send(datosUsuario);

    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.message).toBe('Usuario registrado exitosamente');
    usuarioCreado = true;

    // 2. LOGIN
    console.log('Paso 2: Iniciando sesión...');
    const loginRes = await request(app)
      .post('/login')
      .send({ 
        usuario: datosUsuario.correo, 
        contrasena: datosUsuario.contrasena 
      });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
    expect(loginRes.body).toHaveProperty('usuario', datosUsuario.correo);
    expect(loginRes.body.roles.rolpaciente).toBe(true);

    const token = loginRes.body.token;

    // 3. ACCESO A RUTA PROTEGIDA
    console.log('Paso 3: Accediendo a ruta protegida...');
    
    // Primero necesitamos obtener el ID del usuario creado
    const usuarioDb = await SystemUsers.findOne({ 
      where: { usuario: datosUsuario.correo } 
    });
    
    const protectedRes = await request(app)
      .get(`/usuarios/${usuarioDb.idusuario}`)
      .set('Authorization', `Bearer ${token}`);

    expect(protectedRes.statusCode).toBe(200);
    expect(protectedRes.body.usuario).toBe(datosUsuario.correo);

    console.log('Flujo completo exitoso');
  });

  it('debería fallar el login con credenciales de usuario no registrado', async () => {
    const loginRes = await request(app)
      .post('/login')
      .send({ 
        usuario: 'noexiste@test.com', 
        contrasena: 'cualquierpass' 
      });

    expect(loginRes.statusCode).toBe(401);
    expect(loginRes.body.message).toMatch(/No existe el usuario/i);
  });

  it('debería fallar el acceso protegido después de registro pero sin login', async () => {
    // Registrar usuario pero no hacer login
    const registerRes = await request(app)
      .post('/register')
      .send({
        ...datosUsuario,
        correo: `nologin_${Date.now()}@test.com`
      });

    expect(registerRes.statusCode).toBe(201);

    // Intentar acceder sin token
    const protectedRes = await request(app).get('/usuarios/1');

    expect(protectedRes.statusCode).toBe(401);
    expect(protectedRes.body.message).toMatch(/Token no proporcionado/i);
  });
});