#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict_mode.sh
export PATH="${PWD}/node_modules/.bin:$PATH"

trim_js='
delete this.address;
delete this.host;
delete this.hostname;
delete this.id;
delete this.level;
delete this.name;
delete this.pid;
delete this.port;
delete this.protocol;
delete this.responseTime;
delete this.time;
delete this.uri;
delete this.v;
'
# trim_js='
# for (let key in this) {
#   if (["msg", "tags"].includes(key)) {
#     continue;
#   }
#   delete this[key];
# }
# '
nodemon "$@" app/main.js |
  grep --line-buffered -v nodemon |
  json -ga0 -E "${trim_js}"
  # json -ga0 msg tags
