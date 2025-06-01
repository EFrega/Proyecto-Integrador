module.exports = (sequelize, DataTypes) => {
    const AgendaProfExcep = sequelize.define('AgendaProfExcep', {
        idprofesional: {
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
        tipo_licencia: {
            type: DataTypes.STRING(255)
        }
    }, {
        tableName: 'AgendaProfExcep',
        timestamps: false
    });
    return AgendaProfExcep;
};
