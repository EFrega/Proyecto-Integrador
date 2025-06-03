const sequelize = require('../config/database');
const SystemUsersModel = require('../models/systemusers');
const ContactosModel = require('../models/contactos');

const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);
const Contactos = ContactosModel ? ContactosModel(sequelize, require('sequelize').DataTypes) : null;

describe('Validación de Modelos', () => {
  describe('SystemUsers Model', () => {
    it('debería cifrar la contraseña antes de guardar', async () => {
      const contrasenaOriginal = 'MiPassword123';
      
      const usuario = await SystemUsers.create({
        usuario: `bcrypt_test_${Date.now()}@test.com`,
        contrasena: contrasenaOriginal,
        rolpaciente: true
      });

      // La contraseña guardada debe ser diferente a la original (cifrada)
      expect(usuario.contrasena).not.toBe(contrasenaOriginal);
      expect(usuario.contrasena).toMatch(/^\$2[aby]\$\d+\$/); // Formato bcrypt

      // Debe poder comparar correctamente
      const esCorrecta = await usuario.comparePassword(contrasenaOriginal);
      expect(esCorrecta).toBe(true);

      const esIncorrecta = await usuario.comparePassword('password_incorrecto');
      expect(esIncorrecta).toBe(false);

      // Limpiar
      await usuario.destroy();
    });

    it('debería tener campos requeridos', async () => {
      await expect(SystemUsers.create({})).rejects.toThrow();
    });

    it('debería validar valores booleanos para roles', async () => {
      const usuario = await SystemUsers.create({
        usuario: `roles_test_${Date.now()}@test.com`,
        contrasena: 'Test123',
        rolpaciente: true,
        rolmedico: false,
        roladministrativo: false,
        rolsuperadmin: false
      });

      expect(typeof usuario.rolpaciente).toBe('boolean');
      expect(typeof usuario.rolmedico).toBe('boolean');
      expect(typeof usuario.roladministrativo).toBe('boolean');
      expect(typeof usuario.rolsuperadmin).toBe('boolean');

      await usuario.destroy();
    });
  });

  if (Contactos) {
    describe('Contactos Model', () => {
      it('debería crear contacto con datos válidos', async () => {
        const contacto = await Contactos.create({
          nombre: 'Test',
          apellido: 'User',
          docum: `${Date.now()}`,
          tipodoc: 'DNI',
          fechanacim: '1990-01-01',
          telcontacto: '123456789',
          correo: `contacto_test_${Date.now()}@test.com`,
          direccion: 'Test Address 123'
        });

        expect(contacto.nombre).toBe('Test');
        expect(contacto.apellido).toBe('User');
        expect(contacto.idcontacto).toBeDefined();

        await contacto.destroy();
      });

      it('debería fallar con datos inválidos', async () => {
        // Este test depende de las validaciones que tengas en el modelo
        await expect(Contactos.create({
          // Datos incompletos o inválidos
        })).rejects.toThrow();
      });
    });
  }

  describe('Relaciones entre Modelos', () => {
    it('debería mantener integridad referencial', async () => {
      // Crear contacto
      const contacto = await Contactos.create({
        nombre: 'Relacion',
        apellido: 'Test',
        docum: `${Date.now()}`,
        tipodoc: 'DNI',
        fechanacim: '1990-01-01',
        telcontacto: '123456789',
        correo: `relacion_test_${Date.now()}@test.com`,
        direccion: 'Test Address 123'
      });

      // Crear usuario asociado
      const usuario = await SystemUsers.create({
        idcontacto: contacto.idcontacto,
        usuario: contacto.correo,
        contrasena: 'Test123',
        rolpaciente: true
      });

      expect(usuario.idcontacto).toBe(contacto.idcontacto);

      // Limpiar en orden correcto (usuario primero por FK)
      await usuario.destroy();
      await contacto.destroy();
    });
  });
});