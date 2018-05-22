#!/usr/bin/env bash

cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict-mode.sh
./bin/test-node.sh
./bin/test-browser.js
