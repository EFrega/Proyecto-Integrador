module.exports = (sequelize, DataTypes) => {

    const ChatMsgs = sequelize.define('ChatMsgs', {
        idmsg: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        idchat: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        idsystemuseremisor: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        msgtexto: {
        type: DataTypes.STRING(500),
        allowNull: false
        },
        msgtimesent: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
        },
        msgstatus: {
        type: DataTypes.INTEGER,
        defaultValue: 1
        }
    }, {
        tableName: 'ChatMsgs',
        timestamps: false
    });

    return ChatMsgs;
};