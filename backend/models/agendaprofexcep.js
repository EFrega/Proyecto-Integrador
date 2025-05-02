module.exports = (sequelize, DataTypes) => {
    const AgendaProfExcep = sequelize.define('AgendaProfExcep', {
        idprofesional: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        idservicio: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        dia_inicio: {
            type: DataTypes.DATE,
            primaryKey: true
        },
        dia_fin: {
            type: DataTypes.DATE
        },
        hora_inicio: {
            type: DataTypes.TIME
        },
        hora_fin: {
            type: DataTypes.TIME
        },
        disponible: {
            type: DataTypes.BOOLEAN
        },
        motivo_inasistencia: {
            type: DataTypes.STRING(255)
        }
    }, {
        tableName: 'AgendaProfExcep',
        timestamps: false
    });
    return AgendaProfExcep;
};
