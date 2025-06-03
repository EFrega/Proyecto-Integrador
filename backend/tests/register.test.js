const request = require('supertest');
const { app } = require('../server/index');
const sequelize = require('../config/database');

// Importar modelos
const SystemUsersModel = require('../models/systemusers');
const ContactosModel = require('../models/contactos');

const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);
const Contactos = ContactosModel(sequelize, require('sequelize').DataTypes);

describe('POST /register', () => {
  // Datos de prueba válidos
  const datosUsuarioValido = {
    nombre: 'Juan',
    apellido: 'Pérez',
    docum: '12345678',
    tipodoc: 'DNI',
    fechanacim: '1990-05-15',
    telcontacto: '123456789',
    telemergencia: '987654321',
    correo: `test_${Date.now()}@test.com`, // Email único
    direccion: 'Calle Falsa 123',
    usuario: 'testuser',
    contrasena: 'Test1234'
  };

  let usuarioCreado;

  afterEach(async () => {
    // Limpiar datos después de cada test
    if (usuarioCreado) {
      const t = await sequelize.transaction();
      try {
        // Eliminar usuario
        await SystemUsers.destroy({ 
          where: { usuario: datosUsuarioValido.correo },
          transaction: t 
        });
        
        // Eliminar contacto
        await Contactos.destroy({ 
          where: { correo: datosUsuarioValido.correo },
          transaction: t 
        });
        
        await t.commit();
        usuarioCreado = null;
      } catch (error) {
        await t.rollback();
        console.error('Error limpiando datos de test:', error);
      }
    }
  });

  it('debería registrar un nuevo usuario correctamente', async () => {
    const res = await request(app)
      .post('/register')
      .send(datosUsuarioValido);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Usuario registrado exitosamente');
    
    // Verificar que se creó el contacto
    const contacto = await Contactos.findOne({ 
      where: { correo: datosUsuarioValido.correo } 
    });
    expect(contacto).toBeTruthy();
    expect(contacto.nombre).toBe(datosUsuarioValido.nombre);
    expect(contacto.apellido).toBe(datosUsuarioValido.apellido);
    
    // Verificar que se creó el usuario
    const usuario = await SystemUsers.findOne({ 
      where: { usuario: datosUsuarioValido.correo } 
    });
    expect(usuario).toBeTruthy();
    expect(usuario.idcontacto).toBe(contacto.idcontacto);
    expect(usuario.rolpaciente).toBe(true);
    expect(usuario.rolmedico).toBe(false);
    
    usuarioCreado = true;
  });

  it('debería fallar con datos incompletos', async () => {
    const datosIncompletos = {
      nombre: 'Juan',
      correo: 'test@test.com'
      // Faltan campos requeridos
    };

    const res = await request(app)
      .post('/register')
      .send(datosIncompletos);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Error al registrar el usuario');
  });

  it('debería fallar con email duplicado', async () => {
    // Primer registro
    await request(app)
      .post('/register')
      .send(datosUsuarioValido);
    
    usuarioCreado = true;

    // Segundo registro con mismo email
    const datosConEmailDuplicado = {
      ...datosUsuarioValido,
      nombre: 'Pedro', // Cambiar nombre pero mantener email
      docum: '87654321' // Cambiar documento
    };

    const res = await request(app)
      .post('/register')
      .send(datosConEmailDuplicado);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Error al registrar el usuario');
  });

  it('debería fallar con documento duplicado', async () => {
    // Primer registro
    await request(app)
      .post('/register')
      .send(datosUsuarioValido);
    
    usuarioCreado = true;

    // Segundo registro con mismo documento
    const datosConDocDuplicado = {
      ...datosUsuarioValido,
      correo: `otro_${Date.now()}@test.com`, // Email diferente
      docum: datosUsuarioValido.docum // Mismo documento
    };

    const res = await request(app)
      .post('/register')
      .send(datosConDocDuplicado);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Error al registrar el usuario');
  });

  it('debería validar formato de email', async () => {
    const datosConEmailInvalido = {
      ...datosUsuarioValido,
      correo: 'email-invalido'
    };

    const res = await request(app)
      .post('/register')
      .send(datosConEmailInvalido);

    expect(res.statusCode).toBe(500);
  });

  it('debería validar longitud de contraseña', async () => {
    const datosConContrasenaCorta = {
      ...datosUsuarioValido,
      contrasena: '123' // Muy corta
    };

    const res = await request(app)
      .post('/register')
      .send(datosConContrasenaCorta);

    // El resultado depende de si tienes validación en el modelo
    // Si no tienes validación, este test fallará y te ayudará a identificar la necesidad
    expect(res.statusCode).toBe(500);
  });

  it('debería manejar fechas de nacimiento inválidas', async () => {
    const datosConFechaInvalida = {
      ...datosUsuarioValido,
      fechanacim: '1800-01-01' // Fecha muy antigua
    };

    const res = await request(app)
      .post('/register')
      .send(datosConFechaInvalida);

    // Este test te ayudará a decidir si necesitas validación de fechas
    expect([201, 500]).toContain(res.statusCode);
  });
});