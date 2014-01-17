projectRoot = "#{__dirname}/.."
exports.site = "localhost"
exports.port = 9000
exports.baseURL = "http://#{exports.site}:#{exports.port}"
exports.appURI = "/app"
#Listen on all IPs in dev/test (for testing from other machines),
#But loopback in stage/prod since nginx listens on the routed interface
exports.loopback = false
exports.errorPages = true
exports.titleSuffix = " | Peter Lyons"
exports.staticDir = "#{projectRoot}/../static"
exports.photos =
  photoURI: "/photos/"
  galleryURI: exports.appURI + "/photos"
  galleryDir:  exports.staticDir + "/photos"
  thumbExtension: "-TN.jpg"
  extension: ".jpg"
  galleryDataPath: "#{projectRoot}/../data/galleries.json"
  serveDirect: true
exports.tests = false
exports.cacheCSS = false
exports.blog =
  hashPath: "#{projectRoot}/../data/blog_password.bcrypt"
  postBasePath: "#{projectRoot}/../data/posts"
exports.inspector =
  enabled: false
  webPort: exports.port + 2
switch process.env.NODE_ENV
  when "production", "stage"
    exports.site = "peterlyons.com"
    exports.baseURL = "http://#{exports.site}"
    exports.loopback = true
    exports.photos.serveDirect = false
    exports.errorPages = false
    exports.cacheCSS = true
  when "stage"
    exports.site = "stage.peterlyons.com"
    exports.baseURL = "http://#{exports.site}"
    exports.loopback = true
    exports.photos.serveDirect = false
  else
    exports.tests = true
    exports.blogPreviews = true
    exports.inspector.enabled = true
