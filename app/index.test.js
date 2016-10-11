const request = require('./request')
const expect = require('chaimel')

describe('the express web server basics', function () {
  it('GET /no-such-url should be 404', function (done) {
    request.get('/no-such-url').expect(404).end(done)
  })

  it('GET / should have security headers', function (done) {
    request
    .get('/')
    .expect('x-frame-options', 'DENY')
    .expect('x-content-type-options', 'nosniff')
    .expect('x-xss-protection', '1')
    .end((error, res) => {
      expect(error).notToExist()
      expect(res.headers['x-powered-by']).notToExist()
      done()
    })
  })
})

request.smoke(require('./test-configs'))
