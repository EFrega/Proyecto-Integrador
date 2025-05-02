const { Sequelize } = require('sequelize');

// Crear la instancia de Sequelize
const sequelize = new Sequelize('pp4_clinica', 'pp4_root', 'Sabbah2505', {
    port: 3306,
    host: 'db4free.net',
    dialect: 'mysql',
});

module.exports = sequelize;  // Exportamos la instancia de sequelize
