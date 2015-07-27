var autoprefixer = require('autoprefixer-stylus')
var nib = require('nib')
var rupture = require('rupture')
var stylish = require('stylish')

function setup (app) {
  app.use(stylish({
    src: __dirname,
    compress: true,
    setup: function (renderer) {
      return renderer
        .use(nib())
        .use(rupture())
        .use(autoprefixer())
    }
  }))
}

module.exports = setup
