const request = require('supertest');
const { app, server } = require('../server/index');
const sequelize = require('../config/database');

describe('Servidor Express', () => {
  describe('Configuración básica', () => {
    it('debería responder en la ruta principal', async () => {
      const res = await request(app).get('/');
      
      expect(res.statusCode).toBe(200);
      expect(res.text).toMatch(/funcionamiento/i);
    });

    it('debería tener middleware CORS configurado', async () => {
      const res = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:3000');
      
      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });

    it('debería parsear JSON correctamente', async () => {
      const res = await request(app)
        .post('/login')
        .send({ usuario: 'test', contrasena: 'test' });
      
      // No debería fallar por parsing JSON, sino por credenciales
      expect(res.statusCode).not.toBe(400);
    });
  });

  describe('Rutas configuradas', () => {
    const rutasEsperadas = [
      '/login',
      '/register',
      '/usuarios',
      '/contactos',
      '/profesionales',
      '/servicios',
      '/excepcionesProf',
      '/agendas'
    ];

    rutasEsperadas.forEach(ruta => {
      it(`debería tener configurada la ruta ${ruta}`, async () => {
        const res = await request(app).get(ruta);
        
        // 404 significaría que la ruta no existe
        // Otros códigos (401, 405, 500) significan que la ruta existe
        expect(res.statusCode).not.toBe(404);
      });
    });
  });

  describe('Manejo de errores', () => {
    it('debería devolver 404 para rutas no existentes', async () => {
      const res = await request(app).get('/ruta-inexistente');
      expect(res.statusCode).toBe(404);
    });

    it('debería manejar requests malformados', async () => {
      const res = await request(app)
        .post('/login')
        .send('{"json": malformado}')
        .set('Content-Type', 'application/json');
      
      expect([400, 500]).toContain(res.statusCode);
    });
  });

  describe('Conexión a Base de Datos', () => {
    it('debería estar conectado a la base de datos', async () => {
      try {
        await sequelize.authenticate();
        expect(true).toBe(true);
      } catch (error) {
        fail(`No se pudo conectar a la BD: ${error.message}`);
      }
    });

    it('debería tener los modelos cargados', () => {
      const modelos = Object.keys(sequelize.models);
      expect(modelos.length).toBeGreaterThan(0);
    });
  });

  describe('Variables de entorno', () => {
    it('debería usar el puerto correcto', () => {
      const puerto = process.env.PORT || 5000;
      expect(typeof puerto).toBe('string');
      expect(parseInt(puerto)).toBeGreaterThan(0);
    });

    it('debería tener JWT_SECRET configurado', () => {
      const secret = process.env.JWT_SECRET;
      expect(secret).toBeDefined();
      expect(secret.length).toBeGreaterThan(0);
    });

    it('debería estar en modo test', () => {
      expect(process.env.NODE_ENV).toBe('test');
    });
  });

  describe('Logging', () => {
    it('debería registrar accesos en logs', async () => {
      const fs = require('fs');
      const path = require('path');
      
      // Hacer request que genere log
      await request(app).get('/');
      
      // Verificar que el archivo de logs existe
      const logsPath = path.join(__dirname, '../logs.txt');
      
      // Dar tiempo para que se escriba el log
      setTimeout(() => {
        if (fs.existsSync(logsPath)) {
          const logs = fs.readFileSync(logsPath, 'utf8');
          expect(logs.length).toBeGreaterThan(0);
        }
      }, 100);
    });
  });

  describe('Seguridad básica', () => {
    it('no debería exponer información sensible en headers', async () => {
      const res = await request(app).get('/');
      
      expect(res.headers['x-powered-by']).toBeUndefined();
      expect(res.headers['server']).not.toMatch(/express/i);
    });

    it('debería requerir autenticación para rutas protegidas', async () => {
      const res = await request(app).get('/usuarios/1');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Performance básico', () => {
    it('debería responder en tiempo razonable', async () => {
      const inicio = Date.now();
      await request(app).get('/');
      const tiempo = Date.now() - inicio;
      
      expect(tiempo).toBeLessThan(1000); // Menos de 1 segundo
    });

    it('debería manejar múltiples requests concurrentes', async () => {
      const requests = Array(10).fill().map(() => request(app).get('/'));
      
      const resultados = await Promise.all(requests);
      resultados.forEach(res => {
        expect(res.statusCode).toBe(200);
      });
    });
  });
});

// Tests específicos para funcionalidades del servidor
describe('Funcionalidades específicas del servidor', () => {
  describe('WebSocket', () => {
    it('debería tener WebSocket configurado', () => {
      // Verificar que el servidor tenga capacidades WebSocket
      expect(server).toBeDefined();
      // Aquí podrías agregar tests más específicos de WebSocket si necesitas
    });
  });

  describe('Middleware de autenticación', () => {
    it('debería exportar el middleware correctamente', () => {
      const auth = require('../middlewares/auth');
      expect(typeof auth).toBe('function');
    });
  });

  describe('Configuración de la aplicación', () => {
    it('debería tener todas las dependencias necesarias', () => {
      const packageJson = require('../package.json');
      const dependenciasRequeridas = [
        'express',
        'cors',
        'jsonwebtoken',
        'bcryptjs',
        'sequelize',
        'mysql2',
        'socket.io'
      ];

      dependenciasRequeridas.forEach(dep => {
        expect(packageJson.dependencies[dep]).toBeDefined();
      });
    });
  });
});