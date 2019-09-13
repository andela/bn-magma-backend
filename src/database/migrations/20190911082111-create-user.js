module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: { type: Sequelize.STRING, allowNull: false },
    lastName: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    password: { type: Sequelize.STRING, allowNull: false },
    isVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
    gender: {
      type: Sequelize.ENUM('Male', 'Female', 'Other'),
      allowNull: true
    },
    birthDate: { type: Sequelize.DATEONLY, allowNull: true },
    preferredLanguage: { type: Sequelize.STRING, allowNull: true },
    address: { type: Sequelize.TEXT, allowNull: true },
    phoneNumber: { type: Sequelize.STRING, allowNull: true },
    role: { type: Sequelize.ENUM('requestManager', 'superAdmin', 'user'), defaultValue: 'user' },
    department: { type: Sequelize.STRING, allowNull: true },
    lineManager: { type: Sequelize.INTEGER, allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  }),
  down: (queryInterface) => queryInterface.dropTable('Users')
};
