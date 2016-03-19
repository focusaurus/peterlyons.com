var join = require('path').join
var pack = require('./package')

var IS_PRODUCTION = process.env.NODE_ENV === 'production'

function get (name, defaultValue) {
  return process.env['PLWS_' + name.toUpperCase()] || defaultValue
}

var config = {
  appURI: '/app',
  appVersion: pack.version,
  enableLogger: false, // process.env.NODE_ENV !== 'test',
  hostname: get('hostname', '127.0.0.1'),
  ip: get('IP', '127.0.0.1'),
  proPort: get('proport', 9000),
  persPort: get('persport', 9001),
  staticDir: join(__dirname, '../static'),
  titleSuffix: ' | Peter Lyons',
  revealDir: join(__dirname, 'node_modules/reveal'),
  wwwDir: join(__dirname, 'www'),
  zeroClipboardDir: join(__dirname, 'node_modules/zeroclipboard/dist')
}

config.analytics = {
  enabled: IS_PRODUCTION,
  proCode: '',
  persCode: ''
}

config.photos = {
  photoURI: '/photos/',
  galleryURI: config.appURI + '/photos-react',
  galleryDir: config.staticDir + '/photos',
  thumbExtension: '-TN.jpg',
  extension: '.jpg',
  serveDirect: !IS_PRODUCTION
}

config.blog = {
  hashPath: join(__dirname, '../data/blog_password.bcrypt'),
  newBlogPreparePath: join(__dirname, 'bin/new-blog-prepare.sh'),
  newBlogFinalizePath: join(__dirname, 'bin/new-blog-finalize.sh')
}

config.tests = {
  port: get('testPort', 9002),
  debugPort: get('testDebugPort', 9004),
  mochaPath: join(__dirname, 'node_modules/mocha')
}

module.exports = config
