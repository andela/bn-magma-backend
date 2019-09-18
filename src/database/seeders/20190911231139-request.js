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
    userId: 5,
    origin: 'Toronto',
    destination: 'Madgasscar',
    type: 'one-way',
    departureDate: '2013-11-19',
    reason: 'New Engagement',
    lineManager: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 5,
    origin: 'Texas',
    destination: 'Syria',
    type: 'one-way',
    departureDate: '2020-03-15',
    reason: 'Relocation',
    lineManager: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {})
};
