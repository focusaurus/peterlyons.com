#!/bin/bash
cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh
export PATH="${PWD}/node_modules/.bin:$PATH"

echo -n "linting…"
eslint --format ./node_modules/eslint-tap app
echo ✓
