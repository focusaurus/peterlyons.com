var supertest = require('supertest')

function smokeTests (description, appOrUrl, pairs) {
  var request = supertest(appOrUrl)
  describe(description, function () {
    pairs.forEach(function (pair) {
      var uri = pair[0]
      var regex = pair[1]
      it('should load' + uri, function (done) {
        request.get(uri).expect(200).expect(regex).end(done)
      })
    })
  })
}

module.exports = smokeTests
