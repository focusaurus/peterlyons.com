#!/bin/bash

# bundles browser js for production

cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh
unset IFS # This screws up our shell quoting

browserify $(./bin/browserify_args.sh) "$@" | uglifyjs --no-mangle > www/plws.js
browserify -e app/browser/deck | uglifyjs --no-mangle > www/reveal.js
