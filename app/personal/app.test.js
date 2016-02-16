var request = require('./request')

var testConfigs = [
  ['/', /personal site/],
  ['/bands', /Afronauts/],
  ['/oberlin', /Edison/],
  ['/favorites', /Imogen/],
  ['/persblog', /travel/],
  ['/app/photos?gallery=burning_man_2011', /Gallery/],
  ['/persblog/2007/10/hometown-dracula', /Randall/]
]

request.smoke(testConfigs)
