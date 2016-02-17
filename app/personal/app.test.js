var request = require('./request')
var expect = require('chaimel')

var testConfigs = [
  ['/', /personal site/],
  ['/bands', /Afronauts/],
  ['/oberlin', /Edison/],
  ['/favorites', /Imogen/],
  ['/persblog', /travel/],
  ['/app/photos?gallery=burning_man_2011', /Gallery/],
  ['/persblog/2007/10/hometown-dracula', /Randall/]
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
