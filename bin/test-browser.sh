#!/usr/bin/env bash

# run automated test suite and linting
cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict_mode.sh
echo -n browser tests…
node app/headless-tests.js
echo ✓
