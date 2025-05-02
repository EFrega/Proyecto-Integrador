module.exports = (sequelize, DataTypes) => {
    const Turnos = sequelize.define('Turnos', {
        idturno: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        idcontacto: {
            type: DataTypes.INTEGER
        },
        idservicio: {
            type: DataTypes.INTEGER
        },
        idprofesional: {
            type: DataTypes.INTEGER
        },
        hora: {
            type: DataTypes.TIME
        },
        dia: {
            type: DataTypes.DATE
        },
        tipo: {
            type: DataTypes.INTEGER
        },
        prioridad: {
            type: DataTypes.INTEGER
        },
        reservado: {
            type: DataTypes.BOOLEAN
        },
        confirmado: {
            type: DataTypes.BOOLEAN
        },
        acreditado: {
            type: DataTypes.BOOLEAN
        },
        atendido: {
            type: DataTypes.BOOLEAN
        },
        observaciones: {
            type: DataTypes.TEXT
        },
        updsystemuser: {
            type: DataTypes.INTEGER
        },
        updatetime: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'Turnos',
        timestamps: false
    });
    return Turnos;
};
