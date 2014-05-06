var stylish = require("stylish");
var nib = require("nib");

function setup(app) {
  app.use(stylish({
    src:__dirname,
    compress: true,
    setup: function(renderer) {
        return renderer.use(nib());
    }
  }));
}

module.exports = setup;
