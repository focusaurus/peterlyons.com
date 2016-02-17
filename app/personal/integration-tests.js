var request = require('supertest')(process.env.URL)
var configs = [
  ['/app/photos?gallery=burning_man_2011', /Gallery/],
  ['/persblog', /travel/],
  ['/persblog/2007/10/hometown-dracula', /Randall/]
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
