var browserGlob = "browser/**/*.js";
var preprocessors = {};
preprocessors[browserGlob] = ["browserify"];

function setup(config) {
  config.set({
    autoWatch: true,
    reporters: ["mocha"],
    browsers: ["Chrome"],
    frameworks: ["mocha", "browserify"],
    files: [
      "../thirdParty/angular.js",
      "../thirdParty/angular-mocks.js",
      browserGlob
    ],
    preprocessors: preprocessors
  });
}

module.exports = setup;
