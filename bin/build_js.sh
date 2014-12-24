#!/bin/bash
cd $(dirname "$0")/..
browserify $(./bin/browserify_args.sh) "$@" | uglifyjs --no-mangle > www/plws.js
