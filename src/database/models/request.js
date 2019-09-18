export default (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    origin: { type: DataTypes.STRING, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM, values: ['one-way', 'return', 'multi-city'], allowNull: false },
    departureDate: { type: DataTypes.DATE, allowNull: false },
    returnDate: { type: DataTypes.DATE },
    reason: { type: DataTypes.STRING },
    accommodation: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM, values: ['open', 'accepted', 'rejected'], defaultValue: 'open'
    },
  }, {});
  Request.associate = models => {
    Request.hasMany(models.ChildRequest, {
      as: 'ChildRequests',
      foreignKey: 'requestId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Request.belongsTo(models.User, {
      as: 'Requester',
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Request;
};
