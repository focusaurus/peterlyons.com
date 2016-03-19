#!/bin/bash

# bundles browser js for production

cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh
unset IFS # This screws up our shell quoting
export PATH=$PWD/node_modules/.bin:$PATH

browserify $(./bin/browserify-args.sh) "$@" | \
  uglifyjs --compress --keep-fnames --screw-ie8 \
  > www/plws.js
browserify -e app/browser/deck | \
  uglifyjs --compress --keep-fnames --screw-ie8 \
  > www/reveal.js
