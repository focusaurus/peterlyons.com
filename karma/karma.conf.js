var browserGlob = "app/browser/**/*.js";
var preprocessors = {};
preprocessors[browserGlob] = ["browserify"];
preprocessors["app/**/*.js"] = ["browserify"];

function setup(config) {
  config.set({
    basePath: "..",
    autoWatch: true,
    reporters: ["mocha"],
    browsers: ["Chrome"],
    browserify: {
      require: "thirdParty/angular:angular"
    },
    frameworks: ["mocha", "browserify"],
    files: [
      {
        //watch application files,
        // but do not serve them from Karma since they are served by browserify
        pattern: browserGlob,
        watched: true,
        included: false,
        served: false
      },
      'karma/**/*.js'
    ],
    preprocessors: preprocessors
  });
}

module.exports = setup;
