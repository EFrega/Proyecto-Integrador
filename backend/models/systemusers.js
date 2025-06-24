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
      type: DataTypes.INTEGER,
      allowNull: false
    },
    usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        msg: 'El nombre de usuario ya existe'
      },
      validate: {
        len: {
          args: [5, 50],
          msg: 'El usuario debe tener entre 5 y 50 caracteres'
        },
        isEmail: {
          msg: 'El usuario debe tener formato de email válido'
        }
      }
    },
    contrasena: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [6, 100],
          msg: 'La contraseña debe tener al menos 6 caracteres'
        }
      }
    },
    rolpaciente: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    rolmedico: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    roladministrativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    rolsuperadmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'SystemUsers',
    timestamps: false,
    hooks: {
      beforeCreate: async (systemUsers) => {
        if (systemUsers.contrasena) {
          systemUsers.contrasena = await bcrypt.hash(systemUsers.contrasena, 10);
        }
      },
      beforeUpdate: async (systemUsers) => {
        if (systemUsers.changed('contrasena')) {
          systemUsers.contrasena = await bcrypt.hash(systemUsers.contrasena, 10);
        }
      }
    }
  });

  systemUsers.prototype.comparePassword = async function(contrasena) {
    return bcrypt.compare(contrasena, this.contrasena);
  };

  console.log("Modelo Usuario cargado correctamente");

  systemUsers.associate = (models) => {
    systemUsers.belongsTo(models.Contactos, {
      foreignKey: 'idcontacto',
      as: 'contacto' // 👈 debe coincidir con el `as` usado en el include
    });
  };

  return systemUsers;
};
