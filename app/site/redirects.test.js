var testUtils = require('app/testUtils')

describe('legacy URLs with .html suffix should redirect', function () {
  var pages = ['/bands.html', '/oberlin.html']
  pages.forEach(function (page) {
    it(page + ' should redirect without .html', function (done) {
      var noHtml = page.slice(0, page.length - '.html'.length)
      testUtils.get(page).expect(302).expect('location', noHtml).end(done)
    })
  })
})
