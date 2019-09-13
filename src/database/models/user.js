module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    gender: { type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true
    },
    birthDate: { type: DataTypes.DATEONLY, allowNull: true },
    preferredLanguage: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    role: { type: DataTypes.STRING, allowNull: true },
    department: { type: DataTypes.STRING, allowNull: true },
    lineManager: { type: DataTypes.INTEGER, allowNull: true },
    phoneNumber: { type: DataTypes.STRING, allowNull: true }
  }, {});
  User.associate = models => {
    User.hasMany(models.Request, {
      as: 'Requests',
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return User;
};
