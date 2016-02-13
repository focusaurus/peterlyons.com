var request = require('./request')

var testConfigs = [
  ['/', /home/],
  ['/bands', /Afronauts/],
  ['/oberlin', /Edison/],
  ['/favorites', /Imogen/],
  ['/persblog', /travel/],
  ['/app/photos?gallery=burning_man_2011', /Gallery/],
  ['/persblog/2007/10/petes-travel-adventure-2007-begins-friday-october-5th',
    /Alitalia/]
]

request.smoke(testConfigs)
