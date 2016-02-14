var request = require('./request')

describe('the express web server basics', function () {
  it('GET /no-such-url should be 404', function (done) {
    request.get('/no-such-url').expect(404).end(done)
  })

  it('should serve the SCND certificate PDF', function (done) {
    request.get('/scnd.pdf')
      .expect(200)
      .expect('Content-Type', 'application/pdf')
      .end(done)
  })
})
