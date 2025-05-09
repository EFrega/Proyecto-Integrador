const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const systemUsers = sequelize.define('SystemUsers', {
        idusuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        idcontacto: {
            type: DataTypes.INTEGER
        },
        usuario: {
            type: DataTypes.STRING(50)
        },
        contrasena: {
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
        timestamps: false,
        hooks: {
            // Hook para cifrar la contraseña antes de crear o actualizar el usuario
            beforeCreate: async (systemUsers) => {
                if (systemUsers.contrasena) {
                systemUsers.contrasena = await bcrypt.hash(systemUsers.contrasena, 10); // Cifra la contraseña antes de guardarla
                }
            },
            beforeUpdate: async (systemUsers) => {
                if (systemUsers.contrasena) {
                systemUsers.contrasena = await bcrypt.hash(systemUsers.contrasena, 10); // Cifra la contraseña antes de actualizarla
                }
            }
        }
    });
    // Método de instancia para comparar contraseñas
    systemUsers.prototype.comparePassword = async function(contrasena) {
        return bcrypt.compare(contrasena, this.contrasena);  // Compara la contraseña proporcionada con la almacenada
    };

    console.log("Modelo Usuario cargado correctamente");

    return systemUsers;
};

// module.exports = systemUsers;
