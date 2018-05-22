#!/usr/bin/env bash

cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict-mode.sh

unset IFS # This screws up groups variable quoting/parsing
export PATH="${PWD}/node_modules/.bin:$PATH"
echo -n "browserifying…"
./bin/build-js.sh production
echo ✓
echo "node.js tap unit tests…"
if [[ $# -eq 0 ]]; then
  find ./app -name \*-tap.js | sort | xargs tap --jobs-auto ${COVERAGE}
else
  tap --jobs-auto "$@"
fi
echo ✓
