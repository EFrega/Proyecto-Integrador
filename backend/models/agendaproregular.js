module.exports = (sequelize, DataTypes) => {
    const AgendaProRegular = sequelize.define('AgendaProRegular', {
        idprofesional: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        idservicio: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        lun: {
            type: DataTypes.BOOLEAN
        },
        hora_init_lun: {
            type: DataTypes.TIME
        },
        hora_fin_lun: {
            type: DataTypes.TIME
        },
        mar: {
            type: DataTypes.BOOLEAN
        },
        hora_init_mar: {
            type: DataTypes.TIME
        },
        hora_fin_mar: {
            type: DataTypes.TIME
        },
        mie: {
            type: DataTypes.BOOLEAN
        },
        hora_init_mie: {
            type: DataTypes.TIME
        },
        hora_fin_mie: {
            type: DataTypes.TIME
        },
        jue: {
            type: DataTypes.BOOLEAN
        },
        hora_init_jue: {
            type: DataTypes.TIME
        },
        hora_fin_jue: {
            type: DataTypes.TIME
        },
        vie: {
            type: DataTypes.BOOLEAN
        },
        hora_init_vie: {
            type: DataTypes.TIME
        },
        hora_fin_vie: {
            type: DataTypes.TIME
        },
        sab: {
            type: DataTypes.BOOLEAN
        },
        hora_init_sab: {
            type: DataTypes.TIME
        },
        hora_fin_sab: {
            type: DataTypes.TIME
        },
        dom: {
            type: DataTypes.BOOLEAN
        },
        hora_init_dom: {
            type: DataTypes.TIME
        },
        hora_fin_dom: {
            type: DataTypes.TIME
        }
    }, {
        tableName: 'AgendaProRegular',
        timestamps: false
    });
    return AgendaProRegular;
};
