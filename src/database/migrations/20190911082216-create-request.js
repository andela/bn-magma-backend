module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Requests', {
    id: {
      allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
    },
    origin: { type: Sequelize.STRING, allowNull: false },
    destination: { type: Sequelize.STRING, allowNull: false },
    type: { type: Sequelize.ENUM, values: ['one-way', 'return', 'multi-city'], allowNull: false },
    departureDate: { type: Sequelize.DATE, allowNull: false },
    returnDate: { type: Sequelize.DATE },
    reason: { type: Sequelize.STRING },
    accommodation: { type: Sequelize.STRING },
    status: { type: Sequelize.STRING, defaultValue: 'open' },
    userId: {
      type: Sequelize.INTEGER, onDelete: 'CASCADE', references: { model: 'Users', key: 'id' }
    },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
  }),
  down: queryInterface => queryInterface.dropTable('Requests')
};
