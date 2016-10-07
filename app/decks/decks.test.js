const testUtils = require('../test-utils')
const request = require('../request')
const DECKS = require('./decks-routes').DECKS
const expect = require('chaimel')

Object.keys(DECKS).forEach((deck) => {
  describe(`slide deck /${deck}`, function () {
    it('should be a slide deck', function (done) {
      request.loadPage(`/${deck}`, function (error, $) {
        if (error) {
          done(error)
          return
        }
        expect($('.reveal .slides ').length).toEqual(1)
        testUtils.assertSubstrings($, 'reveal.js', '##', 'highlight')
        done(error)
      })
    })
  })
})
