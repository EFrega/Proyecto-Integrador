module.exports = (sequelize, DataTypes) => {
    const SystemUsers = sequelize.define('SystemUsers', {
        idusuario: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        idcontacto: {
            type: DataTypes.INTEGER
        },
        usuario: {
            type: DataTypes.STRING(50)
        },
        contraseña: {
            type: DataTypes.STRING(100)
        },
        rolpaciente: {
            type: DataTypes.BOOLEAN
        },
        rolmedico: {
            type: DataTypes.BOOLEAN
        },
        roladministrativo: {
            type: DataTypes.BOOLEAN
        },
        rolsuperadmin: {
            type: DataTypes.BOOLEAN
        }
    }, {
        tableName: 'SystemUsers',
        timestamps: false
    });
    return SystemUsers;
};
