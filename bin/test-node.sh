#!/usr/bin/env bash

cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict_mode.sh

unset IFS # This screws up groups variable quoting/parsing
export PATH="${PWD}/node_modules/.bin:$PATH"
echo -n "browserifying…"
./bin/build-js.sh production
echo ✓
echo "node.js mocha unit tests…"
export NODE_ENV=test
if [[ $# -eq 0 ]]; then
  mocha $(find ./app -name \*.test.js -print0 | sort | xargs -0)
else
  mocha "$@"
fi
echo ✓
