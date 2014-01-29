var browserGlob = "browser/**/*.js";
var preprocessors = {};
preprocessors[browserGlob] = ["browserify"];

function setup(config) {
  config.set({
    autoWatch: true,
    reporters: ["mocha"],
    browsers: ["Chrome"],
    frameworks: ["mocha", "browserify"],
    files: [browserGlob],
    preprocessors: preprocessors
  });
}

module.exports = setup;
