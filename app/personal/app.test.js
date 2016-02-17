var request = require('./request')
var expect = require('chaimel')

var testConfigs = [
  ['/', /personal site/],
  ['/bands', /Afronauts/],
  ['/oberlin', /Edison/],
  ['/favorites', /Imogen/]
]

request.smoke(testConfigs)

var proNav = [
  'Code Conventions',
  'Career',
  'Projects'
]
describe('the layout for personal site', function () {
  var body
  before(function (done) {
    request.get('/').expect(200).end(function (error, res) {
      body = res && res.text
      done(error)
    })
  })
  proNav.forEach(function (page) {
    it('should not include pro navigation' + page, function () {
      expect(body).notToInclude(page)
    })
  })
})
