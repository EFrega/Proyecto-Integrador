module.exports = (sequelize, DataTypes) => {
    const AgendaFeriados = sequelize.define('AgendaFeriados', {
        dia: {
            type: DataTypes.DATEONLY,
            primaryKey: true
        },
        motivoferiado: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'AgendaFeriados',
        timestamps: false
    });
    return AgendaFeriados;
};
