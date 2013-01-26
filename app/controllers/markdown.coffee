fs = require "fs"
jade = require "jade"
markdown = require("markdown-js").makeHtml

exports.setup = (app) ->
  app.engine ".md", (mdPath, options, callback) ->
    fs.readFile mdPath, "utf8", (error, markdownText) ->
      return callback error if error
      jadeText = "extends layout\nblock body\n  :markdown\n    " + markdownText.split("\n").join("\n    ")
      tplFunction = jade.compile jadeText, {filename: mdPath}
      callback null, tplFunction options
