const request = require('./request')

describe('the express web server basics', function () {
  it('GET /no-such-url should be 404', function (done) {
    request.get('/no-such-url').expect(404).end(done)
  })
})

request.smoke(require('./test-configs'))
