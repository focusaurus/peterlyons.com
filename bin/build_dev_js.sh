#!/bin/bash

# bundles browser js for devlopment

cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh
unset IFS # This screws up our shell quoting

PATH="${PATH}:${PWD}/node_modules/.bin"

watchify \
  -o www/plws.js \
  --debug \
  --entry ./app/browser/main.js
