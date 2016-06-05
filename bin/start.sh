#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict_mode.sh
export PATH="${PWD}/node_modules/.bin:$PATH"

node-dev --debug . | tee -a ./log/app.log
