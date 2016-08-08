const autoprefixer = require('autoprefixer-stylus')
const nib = require('nib')
const rupture = require('rupture')
const stylish = require('stylish')

module.exports = stylish({
  src: __dirname,
  compress: true,
  setup: function (renderer) {
    return renderer
      .use(nib())
      .use(rupture())
      .use(autoprefixer())
  }
})
