const sequelize = require('../config/database');

beforeAll(async () => {
  console.log('Iniciando tests...');

  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_for_testing';

  try {
    await sequelize.authenticate();
    console.log('Conexión a BD de test establecida');

    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados');
  } catch (error) {
    console.error('Error configurando BD para tests:', error);
    throw error;
  }
});

afterEach(async () => {
  console.log('Limpiando después del test...');

  const testPatterns = [
    'test_',
    'testuser',
    'integration_',
    'bcrypt_test_',
    'roles_test_',
    'contacto_test_',
    'relacion_test_',
    'nologin_',
    'protectedtest',
    '@test.com'
  ];

  try {
    for (const pattern of testPatterns) {
      await sequelize.query(
        `DELETE FROM Chat WHERE idcontactoreceptor IN (
          SELECT idcontacto FROM Contactos WHERE correo LIKE '%${pattern}%' OR nombre LIKE '%${pattern}%'
        ) OR idcontactoemisor IN (
          SELECT idcontacto FROM Contactos WHERE correo LIKE '%${pattern}%' OR nombre LIKE '%${pattern}%'
        )`,
        { type: sequelize.QueryTypes.DELETE }
      );

      await sequelize.query(
        `DELETE FROM ChatIndex WHERE idsystemuser1 IN (
          SELECT idcontacto FROM Contactos WHERE correo LIKE '%${pattern}%' OR nombre LIKE '%${pattern}%'
        ) OR idsystemuser2 IN (
          SELECT idcontacto FROM Contactos WHERE correo LIKE '%${pattern}%' OR nombre LIKE '%${pattern}%'
        )`,
        { type: sequelize.QueryTypes.DELETE }
      );

      await sequelize.query(
        `DELETE FROM SystemUsers WHERE usuario LIKE '%${pattern}%'`,
        { type: sequelize.QueryTypes.DELETE }
      );

      await sequelize.query(
        `DELETE FROM Contactos WHERE correo LIKE '%${pattern}%' OR nombre LIKE '%${pattern}%'`,
        { type: sequelize.QueryTypes.DELETE }
      );
    }

    console.log('Datos de test limpiados');
  } catch (error) {
    console.warn('Error limpiando datos de test:', error.message);
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
    console.log('Conexión a BD cerrada');
  } catch (error) {
    console.error('Error cerrando la BD:', error);
  }
});

// Helpers globales
global.generateTestData = (prefix = 'test') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);

  return {
    timestamp,
    random,
    email: `${prefix}_${timestamp}_${random}@test.com`,
    usuario: `${prefix}_user_${timestamp}_${random}`,
    nombre: `TestUser${timestamp}`,
    apellido: `TestApellido${timestamp}`,
    documento: `${timestamp}${random}`.slice(0, 8)
  };
};

global.cleanupTestData = async (identifiers) => {
  try {
    for (const id of identifiers) {
      await sequelize.query(
        `DELETE FROM Chat WHERE idcontactoreceptor = ${id} OR idcontactoemisor = ${id}`,
        { type: sequelize.QueryTypes.DELETE }
      );

      await sequelize.query(
        `DELETE FROM ChatIndex WHERE idsystemuser1 = ${id} OR idsystemuser2 = ${id}`,
        { type: sequelize.QueryTypes.DELETE }
      );

      await sequelize.query(
        `DELETE FROM SystemUsers WHERE usuario LIKE '%${id}%' OR idusuario = ${id}`,
        { type: sequelize.QueryTypes.DELETE }
      );

      await sequelize.query(
        `DELETE FROM Contactos WHERE correo LIKE '%${id}%' OR idcontacto = ${id}`,
        { type: sequelize.QueryTypes.DELETE }
      );
    }
  } catch (error) {
    console.warn('Error en limpieza específica:', error.message);
  }
};
