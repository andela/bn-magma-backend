module.exports = (sequelize, DataTypes) => {
  const ChildRequest = sequelize.define('ChildRequest', {
    destination: { type: DataTypes.STRING, allowNull: false },
    departureDate: { type: DataTypes.DATE, allowNull: false },
    reason: { type: DataTypes.STRING },
    accommodation: { type: DataTypes.STRING },
  }, {});
  ChildRequest.associate = models => {
    ChildRequest.belongsTo(models.Request, {
      as: 'ParentRequest',
      foreignKey: 'requestId',
      targetKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return ChildRequest;
};
