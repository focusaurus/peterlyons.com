#!/bin/bash
cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh

# doc "* validate: Run W3C HTML5 validator against the site HTML"
NODE_ENV=test ./bin/validate.js
