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
<<<<<<< HEAD
    managerId: { type:Sequelize.INTEGER, allowNull: true },
=======
    lineManager: { type:Sequelize.INTEGER, allowNull: true },
>>>>>>> aec2e123d30b45fd82c8ab2af68fe1866f69933c
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
  }),
  down: queryInterface => queryInterface.dropTable('Requests')
};
