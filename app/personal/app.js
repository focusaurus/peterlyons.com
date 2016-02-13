var appCommon = require('../appCommon')
var Blog = require('../blog')
var compression = require('compression')
var express = require('express')
var join = require('path').join

var app = express()
appCommon.head(app)

function render (view) {
  return function renderMW (req, res) {
    res.render('personal/' + view)
  }
}
app.use(compression())
app.get('/', render('home'))
app.get('/oberlin', render('oberlin'))
app.get('/bands', render('bands'))
app.get('/favorites', render('favorites'))
app.use(require('./photos/photosRoutes'))
var persblog = new Blog({
  basePath: join(__dirname, '../../../data/posts/persblog'),
  prefix: '/persblog',
  title: 'The Stretch of Vitality',
  subtitle: 'Sporadic musing and accounts of my personal life'
})
app.use(persblog.prefix, persblog.app)
appCommon.tail(app)

module.exports = app
