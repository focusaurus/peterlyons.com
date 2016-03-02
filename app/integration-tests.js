var request = require('supertest')(process.env.URL)
var smokeTests = require('./smoke-tests')

describe(process.env.URL + ' web server basics', function () {
  it('should serve the SCND certificate PDF', function (done) {
    request.get('/scnd.pdf')
      .expect(200)
      .expect('Content-Type', 'application/pdf')
      .end(done)
  })
})

var configs = [
  ['/problog', /Pete's Points/],
  ['/problog/2009/03/announcing-petes-points', /professional/]
].concat(require('./test-configs'))

smokeTests('blog smoke tests', process.env.URL, configs)
