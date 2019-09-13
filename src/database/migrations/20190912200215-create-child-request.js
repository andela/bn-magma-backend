module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ChildRequests', {
    id: {
      allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
    },
    destination: { type: Sequelize.STRING, allowNull: false },
    departureDate: { type: Sequelize.DATE, allowNull: false },
    reason: { type: Sequelize.STRING },
    accommodation: { type: Sequelize.STRING },
    requestId: {
      type: Sequelize.INTEGER, onDelete: 'CASCADE', references: { model: 'Requests', key: 'id' }
    },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
  }),
  down: queryInterface => queryInterface.dropTable('ChildRequests')
};
