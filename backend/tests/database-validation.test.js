const sequelize = require('../config/database');
const SystemUsersModel = require('../models/systemusers');
const ContactosModel = require('../models/contactos');

const SystemUsers = SystemUsersModel(sequelize, require('sequelize').DataTypes);
const Contactos = ContactosModel(sequelize, require('sequelize').DataTypes);

describe('Validaciones de Base de Datos', () => {
  describe('Validaciones de Contactos', () => {
    let testData;

    beforeEach(() => {
      testData = generateTestData('contacto_validation');
    });

    it('debería rechazar email inválido', async () => {
      await expect(Contactos.create({
        nombre: 'Test',
        apellido: 'User',
        docum: testData.documento,
        tipodoc: 'DNI',
        fechanacim: '1990-01-01',
        correo: 'email-invalido', // Email inválido
        direccion: 'Test Address'
      })).rejects.toThrow(/correo válido/i);
    });

    it('debería rechazar nombre muy corto', async () => {
      await expect(Contactos.create({
        nombre: 'A', // Muy corto
        apellido: 'User',
        docum: testData.documento,
        tipodoc: 'DNI',
        fechanacim: '1990-01-01',
        correo: testData.email,
        direccion: 'Test Address'
      })).rejects.toThrow(/nombre debe tener/i);
    });

    it('debería rechazar tipo de documento inválido', async () => {
      await expect(Contactos.create({
        nombre: 'Test',
        apellido: 'User',
        docum: testData.documento,
        tipodoc: 'INVALIDO', // Tipo inválido
        fechanacim: '1990-01-01',
        correo: testData.email,
        direccion: 'Test Address'
      })).rejects.toThrow(/Tipo de documento inválido/i);
    });

    it('debería rechazar fecha de nacimiento futura', async () => {
      const fechaFutura = new Date();
      fechaFutura.setFullYear(fechaFutura.getFullYear() + 1);
      
      await expect(Contactos.create({
        nombre: 'Test',
        apellido: 'User',
        docum: testData.documento,
        tipodoc: 'DNI',
        fechanacim: fechaFutura.toISOString().split('T')[0],
        correo: testData.email,
        direccion: 'Test Address'
      })).rejects.toThrow(/no puede ser en el futuro/i);
    });

    it('debería rechazar fecha de nacimiento muy antigua', async () => {
      await expect(Contactos.create({
        nombre: 'Test',
        apellido: 'User',
        docum: testData.documento,
        tipodoc: 'DNI',
        fechanacim: '1850-01-01', // Muy antigua
        correo: testData.email,
        direccion: 'Test Address'
      })).rejects.toThrow(/posterior a 1900/i);
    });

    it('debería aceptar todos los tipos de documento válidos', async () => {
      const tiposValidos = ['DNI', 'PASAPORTE', 'CEDULA', 'LC', 'LE'];
      
      for (let i = 0; i < tiposValidos.length; i++) {
        const tipo = tiposValidos[i];
        const datos = generateTestData(`tipo_${tipo}`);
        
        const contacto = await Contactos.create({
          nombre: 'Test',
          apellido: 'User',
          docum: datos.documento,
          tipodoc: tipo,
          fechanacim: '1990-01-01',
          correo: datos.email,
          direccion: 'Test Address'
        });
        
        expect(contacto.tipodoc).toBe(tipo);
        await contacto.destroy();
      }
    });

    it('debería rechazar documentos duplicados', async () => {
      const documentoDuplicado = testData.documento;
      
      // Crear primer contacto
      const contacto1 = await Contactos.create({
        nombre: 'Test1',
        apellido: 'User1',
        docum: documentoDuplicado,
        tipodoc: 'DNI',
        fechanacim: '1990-01-01',
        correo: testData.email,
        direccion: 'Test Address'
      });

      // Intentar crear segundo contacto con mismo documento
      await expect(Contactos.create({
        nombre: 'Test2',
        apellido: 'User2',
        docum: documentoDuplicado, // Documento duplicado
        tipodoc: 'DNI',
        fechanacim: '1990-01-01',
        correo: `otro_${testData.email}`,
        direccion: 'Test Address'
      })).rejects.toThrow();

      await contacto1.destroy();
    });

    it('debería rechazar correos duplicados', async () => {
      const correoDuplicado = testData.email;
      
      // Crear primer contacto
      const contacto1 = await Contactos.create({
        nombre: 'Test1',
        apellido: 'User1',
        docum: testData.documento,
        tipodoc: 'DNI',
        fechanacim: '1990-01-01',
        correo: correoDuplicado,
        direccion: 'Test Address'
      });

      // Intentar crear segundo contacto con mismo correo
      await expect(Contactos.create({
        nombre: 'Test2',
        apellido: 'User2',
        docum: `${testData.documento}2`,
        tipodoc: 'DNI',
        fechanacim: '1990-01-01',
        correo: correoDuplicado, // Correo duplicado
        direccion: 'Test Address'
      })).rejects.toThrow();

      await contacto1.destroy();
    });
  });

  describe('Validaciones de SystemUsers', () => {
    let testData;

    beforeEach(() => {
      testData = generateTestData('user_validation');
    });

    it('debería requerir usuario', async () => {
      await expect(SystemUsers.create({
        // Sin usuario
        contrasena: 'Test123',
        rolpaciente: true
      })).rejects.toThrow();
    });

    it('debería cifrar contraseña automáticamente', async () => {
      const contrasenaOriginal = 'MiPasswordSecreto123';
      
      const usuario = await SystemUsers.create({
        usuario: testData.email,
        contrasena: contrasenaOriginal,
        rolpaciente: true
      });

      // Verificar que se cifró
      expect(usuario.contrasena).not.toBe(contrasenaOriginal);
      expect(usuario.contrasena).toMatch(/^\$2[aby]\$/);
      
      // Verificar que se puede comparar
      const esCorrecta = await usuario.comparePassword(contrasenaOriginal);
      expect(esCorrecta).toBe(true);

      await usuario.destroy();
    });

    it('debería actualizar contraseña cifrada', async () => {
      const usuario = await SystemUsers.create({
        usuario: testData.email,
        contrasena: 'PasswordOriginal123',
        rolpaciente: true
      });

      const contrasenaOriginalCifrada = usuario.contrasena;
      
      // Actualizar contraseña
      await usuario.update({ contrasena: 'NuevaPassword456' });
      
      // Verificar que cambió y sigue cifrada
      expect(usuario.contrasena).not.toBe(contrasenaOriginalCifrada);
      expect(usuario.contrasena).toMatch(/^\$2[aby]\$/);
      
      // Verificar que la nueva funciona
      const funcionaNueva = await usuario.comparePassword('NuevaPassword456');
      expect(funcionaNueva).toBe(true);
      
      // Verificar que la vieja no funciona
      const funcionaVieja = await usuario.comparePassword('PasswordOriginal123');
      expect(funcionaVieja).toBe(false);

      await usuario.destroy();
    });

    it('debería manejar roles como booleanos', async () => {
      const usuario = await SystemUsers.create({
        usuario: testData.email,
        contrasena: 'Test123',
        rolpaciente: 1,
        rolmedico: 0,
        roladministrativo: true,
        rolsuperadmin: false
      });

      // Sequelize debería convertir a booleanos
      expect(typeof usuario.rolpaciente).toBe('boolean');
      expect(typeof usuario.rolmedico).toBe('boolean');
      expect(typeof usuario.roladministrativo).toBe('boolean');
      expect(typeof usuario.rolsuperadmin).toBe('boolean');
      
      expect(usuario.rolpaciente).toBe(true);
      expect(usuario.rolmedico).toBe(false);
      expect(usuario.roladministrativo).toBe(true);
      expect(usuario.rolsuperadmin).toBe(false);

      await usuario.destroy();
    });
  });

  describe('Integridad referencial', () => {
    let testData;

    beforeEach(() => {
      testData = generateTestData('referential');
    });

    it('debería permitir usuario con contacto válido', async () => {
      // Crear contacto
      const contacto = await Contactos.create({
        nombre: 'Test',
        apellido: 'User',
        docum: testData.documento,
        tipodoc: 'DNI',
        fechanacim: '1990-01-01',
        telcontacto: '123456789',
        correo: testData.email,
        direccion: 'Calle Test 123'
      });

      // Crear usuario vinculado al contacto
      const usuario = await SystemUsers.create({
        idcontacto: contacto.idcontacto,
        usuario: testData.email,
        contrasena: 'Password123',
        rolpaciente: true
      });

      expect(usuario.idcontacto).toBe(contacto.idcontacto);

      // Limpiar después del test
      await usuario.destroy();
      await contacto.destroy();
    });

    it('debería fallar si idcontacto no existe', async () => {
      await expect(SystemUsers.create({
        idcontacto: 999999, // ID inexistente
        usuario: testData.email,
        contrasena: 'Password123',
        rolpaciente: true
      })).rejects.toThrow();
    });
  });
});

// Utilidad para generar datos únicos de prueba
function generateTestData(prefix = 'test') {
  const timestamp = Date.now();
  return {
    email: `${prefix}_${timestamp}@test.com`,
    documento: `DNI${timestamp}`
  };
}
