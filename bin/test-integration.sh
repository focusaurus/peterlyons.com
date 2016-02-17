#!/bin/bash

# Run integration tests against deployed app
# Will test stage by default, but pass command line args
# peterlyons.com peterlyons.org
# to test production

cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh

URL="${1-stage.peterlyons.com}" mocha app/integration-tests.js
URL="${2-stage.peterlyons.org}" mocha app/personal/integration-tests.js
