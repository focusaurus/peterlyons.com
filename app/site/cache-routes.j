const cache = require('connect-cache')
const MemoryStorage = require('connect-cache/lib/storages/memory')
const TTL = 60 * 1000
const cacheMW = cache({
  rules: [
    {
      regex: /\.css$/,
      ttl: TTL
    }
  ],
  storage: new MemoryStorage()
})

function setup (app) {
  app.use(cacheMW)
}

module.exports = setup
