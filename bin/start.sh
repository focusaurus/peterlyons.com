#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict_mode.sh
export PATH="${PWD}/node_modules/.bin:$PATH"

nodemon "$@" app/main.js |
  grep --line-buffered -v nodemon |
  json -ga0 .msg
