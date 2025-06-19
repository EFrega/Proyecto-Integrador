module.exports = (sequelize, DataTypes) => {
  const Contactos = sequelize.define('Contactos', {
    idcontacto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [2, 100],
          msg: 'El nombre debe tener entre 2 y 100 caracteres'
        }
      }
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [2, 100],
          msg: 'El apellido debe tener entre 2 y 100 caracteres'
        }
      }
    },
    docum: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        msg: 'El documento ya está registrado'
      }
    },
    tipodoc: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: {
          args: [['DNI', 'PASAPORTE', 'CEDULA', 'LC', 'LE']],
          msg: 'Tipo de documento inválido'
        }
      }
    },
    fechanacim: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: 'Debe ser una fecha válida' },
        isValidFecha(value) {
          const fecha = new Date(value);
          const hoy = new Date();
          const limiteInferior = new Date('1900-01-01');

          if (fecha > hoy) {
            throw new Error('La fecha de nacimiento no puede ser en el futuro');
          }
          if (fecha < limiteInferior) {
            throw new Error('La fecha debe ser posterior a 1900');
          }
        }
      }
    },
    telcontacto: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    telemergencia: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'El correo ya está registrado'
      },
      validate: {
        isEmail: {
          msg: 'Debe ser un correo válido'
        }
      }
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: {
          args: [5, 200],
          msg: 'La dirección debe tener entre 5 y 200 caracteres'
        }
      }
    }
  }, {
    tableName: 'Contactos',
    timestamps: false
  });

  Contactos.associate = function(models) {
    Contactos.hasMany(models.Turnos, {
      foreignKey: 'idcontacto',
      as: 'Turnos'
    });
  };

  return Contactos;
};
