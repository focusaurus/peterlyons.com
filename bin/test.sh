#!/usr/bin/env bash

cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict_mode.sh
./bin/test-node.sh
# ./bin/test-browser.sh
