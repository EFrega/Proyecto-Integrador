module.exports = (sequelize, DataTypes) => {
    const Servicios = sequelize.define('Servicios', {
        idservicio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100)
        },
        activo: {
            type: DataTypes.BOOLEAN
        },
        duracionturno: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'Servicios',
        timestamps: false
    });
    return Servicios;
};
