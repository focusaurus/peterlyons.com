var request = require('supertest')(process.env.URL)

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
]
describe('blog smoke tests', function () {
  configs.forEach(function (config) {
    var uri = config[0]
    var regex = config[1]
    it('should load' + uri, function (done) {
      request.get(uri).expect(200).expect(regex).end(done)
    })
  })
})
