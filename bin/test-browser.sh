#!/usr/bin/env bash

# run automated test suite and linting
cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict_mode.sh
unset IFS # This screws up groups variable quoting/parsing

echo -n browser tests…
browser="--phantom"
if [[ "$1" == "local" ]]; then
  # use this for real browser
  browser="--local $(config3 tests.port)"
fi
zuul ${browser} --ui mocha-bdd --open \
  $(find ./app -name '*.btest.js' -print0 | xargs -0)
echo ✓
