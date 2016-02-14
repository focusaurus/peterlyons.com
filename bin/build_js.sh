#!/bin/bash

# bundles browser js for production

cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh
unset IFS # This screws up our shell quoting
export PATH=$PWD/node_modules/.bin:$PATH

browserify $(./bin/browserify_args.sh) "$@" | uglifyjs --compress > www/plws.js
browserify -e app/browser/deck | uglifyjs --compress > www/reveal.js
