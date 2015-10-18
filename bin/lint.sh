#!/bin/bash
cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh

echo -n "linting…"
eslint --format ./node_modules/eslint-formatter-comment/index.js \
  app bin
echo ✓
