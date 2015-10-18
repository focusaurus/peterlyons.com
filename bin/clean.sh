#!/bin/bash
cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh
# doc "* clean: delete the build directory"
rm -rf ./build ./www/*
