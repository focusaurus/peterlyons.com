var fs = require('fs')
var jade = require('jade')
var path = require('path')

var titles = {
  'code_conventions': 'Code Conventions',
  'leveling_up': 'Leveling Up: Career Advancement for Software Developers'
}

function markdownEngine (mdPath, options, callback) {
  fs.readFile(mdPath, 'utf8', function (error, markdownText) {
    if (error) {
      return callback(error)
    }
    var viewName = path.basename(mdPath).slice(0, -3)
    var title = titles[viewName]
    var jadeText = [
      'extends ../site/layout',
      'block variables',
      '  - title = "' + title + '"',
      'block body',
      '  :marked',
      '    ' + markdownText.split('\n').join('\n    ')
    ].join('\n')
    var tplFunction = jade.compile(jadeText, {
      filename: mdPath
    })
    callback(null, tplFunction(options))
  })
}

module.exports = markdownEngine
