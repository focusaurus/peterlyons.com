var testUtils = require('app/testUtils')

describe('the express web server basics', function () {
  it('GET /no-such-url should be 404', function (done) {
    testUtils.get('/no-such-url').expect(404).end(done)
  })

  it('should serve the SCND certificate PDF', function (done) {
    testUtils.get('/scnd.pdf')
      .expect(200)
      .expect('Content-Type', 'application/pdf')
      .end(done)
  })

  it('should have the CSS', function (done) {
    testUtils.get('/screen.css')
      .expect(200)
      .expect('Content-Type', 'text/css; charset=utf-8')
      .end(done)
  })
})
