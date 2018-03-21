#!/bin/bash

# Run integration tests against deployed app
# Will test local dev by default, but pass command line arg
# "stage" or "production" to test remote systems

cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh

case "$1" in
  stage)
    pro=stage.peterlyons.com
    pers=stage.peterlyons.org
    ;;
  production)
    pro=peterlyons.com
    pers=peterlyons.org
    ;;
  *)
    pro=localhost:9000
    pers=localhost:9001
    ;;
esac

URL="${pro}" mocha app/integration-tests.js
URL="${pers}" mocha app/play/integration-tests.js
