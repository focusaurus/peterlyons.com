var request = require('../request')

describe('the plus party page', function () {
  it('should serve the zeroclipboard swf file', function (done) {
    request.get('/ZeroClipboard.swf')
      .expect('Content-Type', 'application/x-shockwave-flash')
      .expect(200)
      .end(done)
  })
})
