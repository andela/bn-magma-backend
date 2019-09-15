module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Requests', [{
    userId: 1,
    origin: 'New York',
    destination: 'Tokyo',
    type: 'one-way',
    departureDate: '2019-12-25',
    reason: 'New office',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 2,
    origin: 'New York',
    destination: 'Uganda',
    type: 'one-way',
    departureDate: '2019-11-25',
    reason: 'New office',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 2,
    origin: 'Lagos',
    destination: 'Nairobi',
    type: 'one-way',
    departureDate: '2019-08-25',
    reason: 'meeting',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {})
};
