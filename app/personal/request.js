// Expose a configured supertest instance wrapping our express app
// for unit tests
module.exports = require('../test-app')(require('./app'))
