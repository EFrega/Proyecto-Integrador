const { all } = require("../routes/registerRoute");

module.exports = (sequelize, DataTypes) => {
    const Contactos = sequelize.define('Contactos', {
        idcontacto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(100)
        },
        apellido: {
            type: DataTypes.STRING(100)
        },
        docum: {
            type: DataTypes.STRING(50)
        },
        tipodoc: {
            type: DataTypes.STRING(20)
        },
        fechanacim: {
            type: DataTypes.DATE
        },
        telcontacto: {
            type: DataTypes.STRING(20)
        },
        telemergencia: {
            type: DataTypes.STRING(20)
        },
        correo: {
            type: DataTypes.STRING(100)
        },
        direccion: {
            type: DataTypes.STRING(200)
        }
    }, {
        tableName: 'Contactos',
        timestamps: false
    });
    return Contactos;
};
