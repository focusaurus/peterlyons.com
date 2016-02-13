// Expose a configured supertest instance wrapping our express app
// for unit tests
module.exports = require('../testApp')(require('./app'))
