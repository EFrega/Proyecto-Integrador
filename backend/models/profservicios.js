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

    ProfServicios.belongsTo(Servicios, {
        foreignKey: 'idservicio',
        as: 'servicio' // 👈 Es el nombre que se usa en el include
    });

    ProfServicios.belongsTo(Profesionales, {
        foreignKey: 'idprofesional'
    });
};
