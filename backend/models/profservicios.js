module.exports = (sequelize, DataTypes) => {
    const ProfServicios = sequelize.define('ProfServicios', {
        idservicio: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        idprofesional: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        activo: {
            type: DataTypes.BOOLEAN
        }
    }, {
        tableName: 'ProfServicios',
        timestamps: false
    });
    return ProfServicios;
};
