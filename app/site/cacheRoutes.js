var cache = require("connect-cache");
var MemoryStorage = require("connect-cache/lib/storages/memory");
var TTL = 60 * 1000;
var cacheMW = cache({
  rules: [
    {regex: /\.css$/, ttl: TTL}
  ],
  storage: new MemoryStorage()
});

function setup(app) {
  app.use(cacheMW);
}

module.exports = setup;
