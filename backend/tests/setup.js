const sequelize = require('../config/database');

beforeAll(async () => {
  console.log('🧪 Iniciando tests...');
  
  // Configurar variables de entorno para tests
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_for_testing';
  
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a BD de test establecida');
    
    // Sincronizar modelos (crear tablas si no existen)
    // IMPORTANTE: force: false para no borrar datos existentes
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados');
    
  } catch (error) {
    console.error('❌ Error configurando BD para tests:', error);
    throw error;
  }
});

beforeEach(async () => {
  console.log('🔄 Preparando test...');
});

afterEach(async () => {
  console.log('🧹 Limpiando después del test...');
  
  // Limpiar datos de test después de cada test
  try {
    // Limpiar solo datos que contengan patrones de test
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

    for (const pattern of testPatterns) {
      // Limpiar SystemUsers
      await sequelize.query(
        `DELETE FROM SystemUsers WHERE usuario LIKE '%${pattern}%'`,
        { type: sequelize.QueryTypes.DELETE }
      );
      
      // Limpiar Contactos
      await sequelize.query(
        `DELETE FROM Contactos WHERE correo LIKE '%${pattern}%' OR nombre LIKE '%${pattern}%'`,
        { type: sequelize.QueryTypes.DELETE }
      );
    }
    
    console.log('✅ Datos de test limpiados');
  } catch (error) {
    console.warn('⚠️ Error limpiando datos de test:', error.message);
  }
});

afterAll(async () => {
  console.log('🧪 Finalizando tests...');
  
  try {
    // Limpieza final más agresiva si es necesario
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

    for (const pattern of testPatterns) {
      await sequelize.query(
        `DELETE FROM SystemUsers WHERE usuario LIKE '%${pattern}%'`,
        { type: sequelize.QueryTypes.DELETE }
      );
      
      await sequelize.query(
        `DELETE FROM Contactos WHERE correo LIKE '%${pattern}%' OR nombre LIKE '%${pattern}%'`,
        { type: sequelize.QueryTypes.DELETE }
      );
    }

    // Cerrar conexión a BD
    await sequelize.close();
    console.log('✅ Conexión a BD cerrada');
  } catch (error) {
    console.error('❌ Error en limpieza final:', error);
  }
});

// Función helper para generar datos de test únicos
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

// Función helper para limpiar datos específicos
global.cleanupTestData = async (identifiers) => {
  try {
    for (const id of identifiers) {
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
    console.warn('⚠️ Error en limpieza específica:', error.message);
  }
};