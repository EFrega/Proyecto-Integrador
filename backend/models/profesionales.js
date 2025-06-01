module.exports = (sequelize, DataTypes) => {
    const Profesionales = sequelize.define('Profesionales', {
        idprofesional: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idcontacto: {
            type: DataTypes.INTEGER
        },
        matricula: {
            type: DataTypes.STRING(100)
        },
        activo: {
            type: DataTypes.BOOLEAN
        }
    }, {
        tableName: 'Profesionales',
        timestamps: false
    });
    return Profesionales;
};
