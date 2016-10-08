const request = require('./request')

describe('the express web server basics', function () {
  it('GET /no-such-url should be 404', function (done) {
    request.get('/no-such-url').expect(404).end(done)
  })

  it('GET / should deny iframes', function (done) {
    request.get('/').expect('X-FRAME-OPTIONS', 'DENY').end(done)
  })
})

request.smoke(require('./test-configs'))
