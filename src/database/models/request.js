export default (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    origin: { type: DataTypes.STRING, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM, values: ['one-way', 'return'], allowNull: false },
    departureDate: { type: DataTypes.DATE, allowNull: false },
    returnDate: { type: DataTypes.DATE },
    reason: { type: DataTypes.STRING },
    accommodation: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'open' }
  }, {});
  Request.associate = models => {
    Request.belongsTo(models.User, {
      as: 'requester',
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Request;
};
