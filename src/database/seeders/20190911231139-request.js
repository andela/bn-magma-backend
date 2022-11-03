module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Requests', [{
    userId: 1,
    origin: 'New York',
    destination: 'Tokyo',
    type: 'one-way',
    departureDate: '2019-12-25',
    returnDate: '2019-12-28',
    reason: 'New office',
    accommodation: 'hdhdgh',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {})
};
