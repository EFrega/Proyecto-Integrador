const { Sequelize } = require('sequelize');

// Configuración con variables de entorno para Docker
const sequelize = new Sequelize(
    process.env.DB_NAME || 'pp4_clinica',
    process.env.DB_USER || 'pp4_root', 
    process.env.DB_PASSWORD || 'Sabbah2505',
    {
        port: process.env.DB_PORT || 3306,
        host: process.env.DB_HOST || 'db4free.net',
        dialect: 'mysql',
        logging: false, // Desactiva los logs de SQL para producción
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

module.exports = sequelize;