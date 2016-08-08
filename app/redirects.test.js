const request = require('./request')

const map = {
  '/code_conventions': '/code-conventions',
  '/leveling_up': '/leveling-up',
  '/npm_gold': '/npm-gold',
  '/plusparty': '/plus-party',
  '/rapid_feedback': '/rapid-feedback',
  '/twelve_factor_nodejs': '/twelve-factor-nodejs',
  '/web_data': '/web-data',
  '/web_prog': '/web-prog',
  '/white_glove': '/white-glove'
}

describe('the pro pages', function () {
  Object.keys(map).forEach(function (old) {
    it('should redirect ' + old, function (done) {
      request
        .get(old)
        .expect(301)
        .expect('Location', map[old])
        .end(done)
    })
  })
})
