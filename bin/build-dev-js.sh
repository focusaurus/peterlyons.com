#!/bin/bash

# bundles browser js for devlopment

cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh
unset IFS # This screws up our shell quoting

PATH="${PATH}:${PWD}/node_modules/.bin"

browserify -o www/reveal.js -e app/browser/deck
"${1-browserify}" \
  -o www/plws.js \
  --debug \
  $(./bin/browserify-args.sh)
browserify -o www/reveal.js -e app/browser/deck
  --entry ./app/browser/main.js
