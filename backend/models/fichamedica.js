module.exports = (sequelize, DataTypes) => {
    const FichaMedica = sequelize.define('FichaMedica', {
        idficha: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idcontacto: {
            type: DataTypes.INTEGER
        },
        gruposang: {
            type: DataTypes.STRING(5)
        },
        cobertura: {
            type: DataTypes.STRING(100)
        },
        histerenfmlia: {
            type: DataTypes.TEXT
        },
        observficha: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'FichaMedica',
        timestamps: false
    });
    return FichaMedica;
};
