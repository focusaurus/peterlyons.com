const request = require('../request')

const codes = [404, 500]
describe('the error pages', function () {
  codes.forEach(function (code) {
    it('should have ' + code, function (done) {
      request.get('/error' + code)
        .expect(code)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .end(done)
    })
  })
})
