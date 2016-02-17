#!/bin/bash

# bundles browser js for devlopment

cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh
unset IFS # This screws up our shell quoting

PATH="${PATH}:${PWD}/node_modules/.bin"

# doc "* bundle: generate browser JS for development"
"${1-browserify}" \
  -o www/plws.js \
  --debug \
  $(./bin/browserify-args.sh)
"${1-browserify}" \
  -o www/plws.js \
  --debug \
  $(./bin/browserify-args.sh)
browserify -o www/reveal.js -e app/browser/deck
