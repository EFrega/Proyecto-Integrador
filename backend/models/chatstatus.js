module.exports = (sequelize, DataTypes) => {
    const ChatStatus = sequelize.define('ChatStatus', {
        msgstatus: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        description: {
        type: DataTypes.STRING(50),
        allowNull: false
        }
    }, {
        tableName: 'ChatStatus',
        timestamps: false
    });

    return ChatStatus;
};