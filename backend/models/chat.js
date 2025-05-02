module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define('Chat', {
        idmsg: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        idchat: {
            type: DataTypes.INTEGER
        },
        idcontactoemisor: {
            type: DataTypes.INTEGER
        },
        idcontactoreceptor: {
            type: DataTypes.INTEGER
        },
        msgdia: {
            type: DataTypes.DATE
        },
        msghora: {
            type: DataTypes.TIME
        },
        msgtexto: {
            type: DataTypes.TEXT
        },
        msgstatus: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'Chat',
        timestamps: false
    });
    return Chat;
};
