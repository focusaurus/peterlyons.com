var blogRoutes = require('app/blogs/blogRoutes')
// This is necessary to cause the blog routes to load
require('app/testUtils')

describe('wait for blogs to be loaded from disk', function () {
  it('should wait for blogRoutes.ready event', function (done) {
    this.slow(3000)
    this.timeout(6000)
    if (blogRoutes.loaded) {
      done()
      return
    }
    blogRoutes.events.on('ready', done)
  })
})
