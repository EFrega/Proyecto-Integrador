module.exports = (sequelize, DataTypes) => {
  const ChatIndex = sequelize.define('ChatIndex', {
    idchat: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    idsystemuser1: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idsystemuser2: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'ChatIndex',
    timestamps: false
  });

  ChatIndex.associate = (models) => {
    ChatIndex.hasMany(models.ChatMsgs, { foreignKey: 'idchat' });
  };

  return ChatIndex;
};