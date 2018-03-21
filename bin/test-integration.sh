#!/bin/bash

# Run integration tests against deployed app
# Will test local dev by default, but pass command line arg
# "stage" or "production" to test remote systems

cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh

case "$1" in
  stage)
    work=https://stage.peterlyons.com
    play=https://stage.peterlyons.org
    ;;
  production)
    work=https://peterlyons.com
    play=https://peterlyons.org
    ;;
  *)
    work=http://localhost:9000
    play=http://localhost:9001
    ;;
esac

URI="${work}" tap 'app/work/**/*-tap.js' 'app/core/**/*-tap.js'
URI="${play}" tap 'app/play/**/*-tap.js'
