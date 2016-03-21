#!/bin/bash
cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh
export PATH="${PWD}/node_modules/.bin:$PATH"

node-dev --debug ./app/server.js | tee -a ./log/app.log
